const express = require("express");
const Stripe = require("stripe");
const Book = require("../model/book"); // Import the Book model
const Order = require("../model/order"); // Import the Order model
const nodemailer = require('nodemailer'); // Import Nodemailer for sending emails
const PDFDocument = require('pdfkit'); // Import PDFKit for generating PDFs
const fs = require('fs'); // Import FileSystem module

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
const readFileContent = async (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
// Function to generate PDF content
const generatePDF = async (items) => {
  const doc = new PDFDocument();
  doc.text('Book Details\n\n');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const fileContent = await readFileContent(item.file); // Read file content

    doc.text(`Book ${i + 1}:`);
    doc.text(`Title: ${item.title}`);
    doc.text(`Description: ${item.description}`);
    doc.text('Content:');
    doc.text(fileContent); // Include file content in the PDF
    doc.text('\n');
  }

  doc.end();
  return doc;
};

router.post("/create-checkout-session", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.cartItems),
      },
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

// Create order function
const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const items = Items.map((item) => {
    return {
      productId: item.id,
      quantity: item.cartQuantity,
    };
  });

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);

    // Attach book files to the email
    const emailOptions = {
      from: 'soulaima.ftouhi@esprit.tn',
      to: customer.email,
      subject: 'Order Confirmation',
      html: `<p>Your order has been successfully placed. Here is your book PDF :</p>`, // HTML text before the PDF attachment
      attachments: [],

    };

    for (const item of Items) {
      // Attach each book file
      emailOptions.attachments.push({
        filename: item.title + ".pdf", // Assuming PDF format, you may need to adjust this
        path: item.file, // Path to the book file
      });
    }

    // Send email with book file attachments
    transporter.sendMail(emailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
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
