const express = require("express");
const Stripe = require("stripe");
const Order = require("../model/order"); // Import the Order model
const nodemailer = require('nodemailer'); // Import Nodemailer for sending emails
const PDFDocument = require('pdfkit'); // Import PDFKit for generating PDFs

require("dotenv").config();
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_KEY_book);

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
      cart: JSON.stringify(req.body.bookItems),
    });

    const customer = await stripe.customers.create({
      metadata: truncatedMetadata,
    });
   

    const line_items = req.body.bookItems.map((bookItem) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookItem.title,
            images: [bookItem.image],

            description: bookItem.description,
            metadata: {
              id: bookItem.id,
              file: bookItem.file, // Add the file metadata
            },
          },
          unit_amount: bookItem.price * 100,
        },
        quantity: bookItem.quantity,
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
      success_url: `${process.env.CLIENT_URL_book}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL_book}/cart`,
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
      bookItems: items.map(bookItem => ({
        productId: bookItem.id,
        quantity: bookItem.cartQuantity,
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
    items.forEach(bookItem => {
      if (bookItem.file) {
        emailAttachments.push({
          filename: `${bookItem.title}.pdf`,
          path: bookItem.file
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

  } catch (error) {
    console.error('Error creating order:', error);
  }
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_a8b920007e264b9f4fbbe70763a71dbe80c64b326600fd97bf6d9a880c14a0c0";

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
