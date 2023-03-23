// const express = require("express");
// const router = express.Router();
// const Classes  = require("../database/models/classes.js");
// const Facility  = require("../database/models/facility.js");
// const verifyManager = require("../middleware/verifyManager.js");
import express from "express";
const router = express.Router();
import Classes from "../database/models/classes.js";
import Facility from "../database/models/facility.js";
import verifyManager from "../middleware/verifyManager.js";

// 1. Add new classes (only for manager)
router.post("/classid", verifyManager, async (req, res, next) => {
    const { name, day, start, end, price, facilityName } = req.body;
    try {
        
        const facility = await Facility.findByPk(facilityName);
        if (!facility) 
            return res.status(404).json("Facility not found");
        // check if class already exist
        const existingClass = await Classes.findOne({ where: {className: name, day: day, startTime: start} });
        if (existingClass) 
            return res.status(401).json("Class already exists");
           
        const classes = await Classes.create({ className: name, day: day, startTime: start, endTime: end, price: price, facilityName: facilityName });
        return res.status(200).json(classes);
    } catch (err) {
        next(err);
    }
});

// 2. Update an existing class (only for manager)
router.put("/:id", verifyManager, async (req, res, next) => {
    try {
        const updateClass = await Classes.findByPk(req.params.id);
        const updatedClass = await updateClass.update(req.body);
        return res.status(200).json(updatedClass);
    } catch (err) {
        next(err);
    }
});

// 3. Delete class (only for manager)
router.delete("/:id", verifyManager, async (req, res, next) => {
    try {
        const classes = await Classes.findByPk(req.params.id);
        if(!classes) return res.status(404).json("Classes not found");
        else { 
            await classes.destroy(req.body);
            res.status(200).json("Class deleted");
        }
    } catch (err) {
        next(err);
    }
});

// 4. Get a class
router.get("/find/:id", async (req, res, next) => {
    try {
        const classes = await Classes.findByPk(req.params.id);
        res.json(classes);
    } catch (err) {
        next(err);
    }
});

// 5. Get all classes
router.get("/", async (req, res, next) => {
    try {
        const classes = await Classes.findAll();
        res.json(classes);
    } catch (err) {
        next(err);
    }
});

export default router