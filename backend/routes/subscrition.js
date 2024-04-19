const express = require("express");
const Stripe = require("stripe");
const User = require("../model/User.model");
require("dotenv").config();
const {PayementEmail} = require('../controller/mailer.js');
const stripe = Stripe("sk_test_51P6HqzKkHBZ7DELsrzuKZyIfMSfI2L6jI4oYF3nAfjbS3L5ffGbAzx7nDmtirh2NCLpK39ezsv0F2EVxGZ8Hp4vl00pIUePMOQ");

const router = express.Router();


router.post(
  "/create-checkout-session",
  async (req, res) => {
    console.log("Request body:", req.body.cartItems);
    try {
      const email = req.body.email;
      const userId = req.body.userId;

      if (!req.body.cartItems) {
        throw new Error("Cart items are missing");
      }

      if (!Array.isArray(req.body.cartItems)) {
        throw new Error("Cart items must be an array");
      }

      const cartItemsString = JSON.stringify(req.body.cartItems);

      const customerParams = {
        email: email, // Add email to customer params
        metadata: {
          userId: req.body.userId,
          cart: cartItemsString,
        },
      };

      const customer = await stripe.customers.create(customerParams);

      const lineItems = req.body.cartItems.map((item, index) => {
        console.log(`Item ${index + 1}:`, item);

        if (typeof item.montant !== 'number' || isNaN(item.montant)) {
          throw new Error(`Invalid montant value for item ${index + 1}: ${item.montant}`);
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.annual,
              metadata: {
                id: item.id,
              },
            },
            unit_amount: item.montant * 100,
          },
          quantity: 1,
        };
      });

      const sessionParams = {
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer: customer.id,
        success_url: `${process.env.CLIENT_URL}/login`,
        cancel_url: `${process.env.CLIENT_URL}/paiementInscri/${userId}`,
      };

      const session = await stripe.checkout.sessions.create(sessionParams);

      res.send({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send("Error creating checkout session");
    }
  }
);


let endpointSecret; // Set your endpoint secret

router.post("/webhook", async (req, res) => {
  try {
    let data;
    let product_data;
    let eventType;
    
    if (endpointSecret) {
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed: ${err}`);
        return res.sendStatus(400);
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body;
      eventType = data.type;
    }

    console.log("Event Type:", eventType);

    if (eventType === "checkout.session.completed") {
      // Option 1: Access email from customer object (if added in create-checkout-session)
      //let customerEmail = data.data.object.customer.email;

      // Option 2: Retrieve customer object and access email
      const customerId = data.data.object.customer;
       const customer = await stripe.customers.retrieve(customerId);
       const customerEmail = customer.email;

      if (customerEmail) {

       // Convertir la chaîne JSON en objet JavaScript
    const cartItems = JSON.parse(customer.metadata.cart);
     

    // Récupérer la valeur de la clé "annual" à partir de l'objet JavaScript
    const annualValue = cartItems[0].annual;

    console.log("Valeur de 'annual' :", annualValue);
        console.log("data/", data);
        const user = await User.findOneAndUpdateByEmail(customerEmail, {
          isPayer: true,
          datePay: Date.now(),// Assuming datePay data is also available in the event
          annual: annualValue, // Assuming annual data is also available in the event
          montant: data.data.object.amount_total/100, // Assuming montant data is also available in the event
        });

        if (user) {
          console.log(`User with email '${customerEmail}' updated:`, user);
        } else {
          console.log(`User with email '${customerEmail}' not found.`);
        }
        // Send payment email
     try {
      await PayementEmail(customerEmail, Date.now(),annualValue,data.data.object.amount_total/100);
      console.log("Payment email sent successfully to:", customerEmail);
  } catch (error) {
      console.error("Error sending payment email:", error);
  }
      } else {
        console.log("Customer email not provided.");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.sendStatus(500);
  }
});
module.exports = router;

