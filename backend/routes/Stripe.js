const express = require("express");
const Stripe = require("stripe");
const { Reservation } = require("../model/reservation");
const Event = require("../model/event"); // Import the Event model

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.cartItems), // Stringify the cartItems array
      },
    });

    const line_items = req.body.cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.imageUrl],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Error creating checkout session");
  }
});

const createReservation = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const events = Items.map((item) => ({
    eventId: item.id,
    name: item.name,
    quantity: item.cartQuantity,
  }));



  try {
    for (const item of Items) {
      const event = await Event.findOne({ name: item.name });
      
      if (event) {
        // Ensure nbrPlaces is a valid number
        event.nbrPlaces = isNaN(event.nbrPlaces) ? 0 : event.nbrPlaces;
        
        // Decrease nbrPlaces by the quantity of tickets booked
        event.nbrPlaces = Math.max(0, event.nbrPlaces - item.quantity);

        // Validate and save the updated event
        await event.validate();
        await event.save();
      } else {
        console.error(`Event with name '${item.name}' not found.`);
      }
    }
    

    // Create a new reservation with the provided data
    const newReservation = new Reservation({
      customerId: data.customer,
      events,
      total: data.amount_total,
      // Save customer email along with other reservation details
      customerEmail: customer.email,
    });

    // Save the new reservation to the database
    const savedReservation = await newReservation.save();

    console.log("Processed Reservation:", savedReservation);
  } catch (err) {
    console.error("Error saving reservation:", err);
  }
};


let webhookSecret;
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.

    // webhookSecret = process.env.STRIPE_WEB_HOOK;

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
            await createReservation(customer, data);
          } catch (err) {
            console.error("Error creating reservation:", err);
          }
        })
        .catch((err) => console.error("Error retrieving customer:", err.message));
    }

    res.status(200).end();
  }
);

module.exports = router;

