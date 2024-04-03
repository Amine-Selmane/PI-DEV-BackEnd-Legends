const express = require("express");
const Stripe = require("stripe");
const Order = require("../model/order"); // Import the Order model
const nodemailer = require('nodemailer'); // Import Nodemailer for sending emails
const PDFDocument = require('pdfkit'); // Import PDFKit for generating PDFs
const twilio = require('twilio');

require("dotenv").config();
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_KEY);

// Create Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'soulaima.ftouhi@esprit.tn',
    pass: 'Abc93461',
  },
});

// Create Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to generate PDF content
const generatePDF = async (orderDetails) => {
  const doc = new PDFDocument();
  doc.text('Order Details\n\n');

  doc.text(`Customer ID: ${orderDetails.customerId}`);
  doc.text(`Payment Intent ID: ${orderDetails.paymentIntentId}`);
  doc.text(`Subtotal: ${orderDetails.subtotal}`);
  doc.text(`Total: ${orderDetails.total}`);
  doc.text(`Payment Status: ${orderDetails.payment_status}`);

  doc.end();
  return doc;
};

// Function to send SMS notification
const sendSMS = async (phoneNumber, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log("SMS notification sent successfully.");
  } catch (error) {
    console.error("Error sending SMS notification:", error);
  }
};
const truncateMetadata = (metadata) => {
  for (const key in metadata) {
    if (typeof metadata[key] === 'string' && metadata[key].length > 500) {
      metadata[key] = metadata[key].substring(0, 500);
    }
  }
  return metadata;
};
router.post("/create-checkout-session", async (req, res) => {
  try {
    // Truncate metadata values if necessary
    const truncatedMetadata = truncateMetadata({
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItems),
    });

    const customer = await stripe.customers.create({
      metadata: truncatedMetadata,
    });
   

    const line_items = req.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
            metadata: {
              id: item.id,
              file: item.file, // Add the file metadata
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE","TN"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    console.log("Session:", session);

    res.send({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Error creating checkout session");
  }
});

// Function to create order
const createOrder = async (customer, data) => {
  try {
    const items = JSON.parse(customer.metadata.cart);
    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.cartQuantity,
      })),
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.customer_details,
      payment_status: data.payment_status,
    });

    // Extract customer's phone number from the customer_details object
    const customerPhoneNumber = data.customer_details.phone;

    // Save the order to the database
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);

    // Generate PDF content
    const pdfContent = await generatePDF(savedOrder);

    // Attach PDF to the email
    const emailAttachments = [{
      filename: 'order_details.pdf',
      content: pdfContent
    }];

    // Attach book files to the email
    items.forEach(item => {
      if (item.file) {
        emailAttachments.push({
          filename: `${item.title}.pdf`,
          path: item.file
        });
      }
    });

    const emailOptions = {
      from: 'soulaima.ftouhi@esprit.tn',
      to: customer.email,
      subject: 'Order Confirmation',
      html: `<p>Your order has been successfully placed. Here is your order details PDF :</p>`, // HTML text before the PDF attachment
      attachments: emailAttachments,
    };

    // Send email with order details PDF attachment and book files
    transporter.sendMail(emailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Send SMS notification to the customer
    const message = "Your order has been successfully placed .Thank you!";
    await sendSMS(customerPhoneNumber, message);
  } catch (err) {
    console.log(err);
  }
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = " whsec_a8b920007e264b9f4fbbe70763a71dbe80c64b326600fd97bf6d9a880c14a0c0";

// Stripe webhook
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            createOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);

module.exports = router;
