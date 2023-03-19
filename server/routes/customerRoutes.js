const express = require("express")
const router = express.Router()
const Customer  = require("../database/models/customer");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validData = require("../middleware/validData");
const verifyToken = require("../middleware/auth")

// routes for registering new customer
router.post("/register", validData, async (req, res) => {
    // destructure req.body (name, number, email, password)
    const { name, number, email, password } = req.body;

    try {
        // check if customer already exist
        const existingCustomer = await Customer.findOne({ where: {customerEmail : email} });
        if (existingCustomer) {
            return res.status(401).send("User already exits");
        }
        // hashes password using bcrypt and inserts a new record into the customer table
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // add new customer to database
        await Customer.create({ customerName: name, customerNumber: number, customerEmail: email, password: bcryptPassword });
        return res.status(200).send("New customer created.");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }    
});

// routes for logging in existing customer
router.post("/login", validData, async (req, res) => {
    // destructure the req.body
    const { email, password } = req.body;

    try {
        // check if customer does not exist
        const customer = await Customer.findOne({ where: {customerEmail : email} });
        if (!customer) {
            return res.status(404).send("User not found");
        }
        // check if the password matches the hashed password stored in database using bcrypt
        const validPassword = await bcrypt.compare(password, customer.password);
        // if password incorrect (does not match)
        if (!validPassword) {
            return res.status(401).send("Email and Password is incorrect");
        }
        // if password match, generates a JWT token for the customer and sends it in JSON format
        const token = jwtGenerator(customer.customerId);

        res.cookie("token", token, {
            httpOnly: true
        })
        .status(200)
        // .json({token});
        return res.status(200).send("Login Successful");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/verify", verifyToken, (req, res, next) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;