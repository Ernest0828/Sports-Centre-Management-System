const express = require("express");
const router = express.Router()
const stripe = require('stripe')('sk_test_51MrbuEHb9PPilNEF1HgDEBmPrJYnSTEeUojKam6GR16HUsfr5G8i0gu5XO1oPJUophzGpa6JxAawBELbzelmuk7b00do44JoiY');
const axios = require('axios');
const Customer  = require("../database/models/customer");
const Activity  = require("../database/models/activity");
const Classes  = require("../database/models/classes");
const Facility = require("../database/models/facility");
const Membership = require("../database/models/membership");

router.post('/booking-checkout-session', async (req, res) => {
   const items = req.body.basketItems;
   console.log("received items:", items)
  const activities = await Promise.all(
    items.map(item => Activity.findByPk(item.activityId))
  );
  console.log("Activities:", activities);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const line_items = items.map((item, index) => {
    const activity = activities[index];
    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: `${item.facilityName} - ${activity.activityName} \n${formatDate(item.date)}-${formatTime(item.startTime)}`,
        },
        unit_amount: item.price * 100,
      },
      quantity: 1, // Update this logic based on your requirements
    };
  });

    const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: 'http://localhost:3000/booking-success', //Takes us here upon successful payment
    cancel_url: 'http://localhost:3000/book-facility', //Change this to something else?
  });
    res.send({url: session.url});
  });


  router.post('/membership-checkout-session', async (req, res) => {

  const MONTHLY_PRICE = "price_1MzjbUHb9PPilNEFvKtFsuP2";
  const ANNUAL_PRICE = "price_1MzjbUHb9PPilNEFvDUoUkWa";
  const membershipType = req.body.memberType;

  let membershipPrice;
  if (membershipType === "MONTHLY") {
    membershipPrice = MONTHLY_PRICE;
  } else if (membershipType === "ANNUAL") {
    membershipPrice = ANNUAL_PRICE;
  } else {
    res.status(400).json({ error: "Invalid membership type" });
    return;
  }

  try{
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: membershipPrice,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/membershipsuccess?membershipType=${membershipType}&success=true`,
      cancel_url: 'http://localhost:3000/pricing',
    });  
     res.send({url: session.url});
  }catch(error){
    res.status(500).json({error: error.message});
  }
   });

  
  router.post('/hooks', async(req, res) => {
      let webhookSecret = 'whsec_402be5c94c101fde0d4506015013f3c524fdcb2a93cca60a99189d03a1686dbc'; 
      
      if(webhookSecret){
      const sig = req.headers['stripe-signature'];

      let event;

      try{
          event = stripe.webhooks.constructEvent(req.rawBody,sig,webhookSecret);
      }catch (error){
        console.log(error.message);
        res.status(400).json({success:false, message: error.message});
        return;
      }
      
      const {customerID}= req.body;
      console.log(customerID)
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSessionCompleted = event.data.object;

          
          break;
        case 'customer.subscription.created':
          const customerSubscriptionCreated = event.data.object;
        
          // Then define and call a function to handle the event customer.subscription.created
          break;
        case 'customer.subscription.deleted':
          const customerSubscriptionDeleted = event.data.object;
          // Then define and call a function to handle the event customer.subscription.deleted
          break;
        case 'customer.subscription.updated':
          const customerSubscriptionUpdated = event.data.object;
          // Then define and call a function to handle the event customer.subscription.updated
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      // console.log(event.type);
      // console.log(event.data.object);
      // console.log(event.data.object.id);
      res.json({success: true});
    }
    });

  module.exports = router;

