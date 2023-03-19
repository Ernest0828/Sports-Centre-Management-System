const express = require("express");
const router = express.Router();
const Staff  = require("../database/models/staff");
const bcrypt = require("bcrypt");
const verifyStaff = require("../middleware/verifyStaff");
const verifyManager = require("../middleware/verifyManager");

// 1. Update staff info
router.put("/:id", verifyStaff, async (req, res, next) => {
    try {
        const updateStaff = await Staff.findByPk(req.params.id);
        await updateStaff.update(req.body);
        res.status(200).send("Updated!");
    } catch (err) {
        next(err);
    }
});

// 2. To find a single staff
router.get("/find/:id", async (req, res, next) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        res.json(staff);
    } catch (err) {
        next(err);
    }
});

// 3. To get all staffs
router.get("/", verifyManager, async (req, res, next) => {
    try {
        const staff = await Staff.findAll();
        res.json(staff);
    } catch (err) {
        next(err);
    }
});

// 4. Change password
router.put("/change-password/:id", verifyStaff, async (req, res, next) => {
        try {
        const { password } = req.body;
        let bcyrptPassword;
        if (password) {
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            bcyrptPassword = await bcrypt.hash(password, salt);
        }
        const updateStaff = await Staff.findByPk(req.params.id);
        await updateStaff.update({ ...req.body, password: bcyrptPassword });
        res.status(200).send("Password updated!")
    } catch (err) {
        next(err);
    }
});

// 5. For staff to delete account
router.delete("/:id", verifyManager, async (req, res, next) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if(!staff) return res.status(404).send("Staff not found");
        else { 
            await staff.destroy(req.body);
            res.status(200).send("Account deleted");
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;