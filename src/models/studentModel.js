const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    class: String,
    busStop: String,
    studentId: String,
    busPassId: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    zipCode: String,
    fatherName: String,
    fatherPhone: String,
    motherName: String,
    motherPhone: String,
    username: { type: String, unique: true },
    password: String,
});

module.exports = mongoose.model('Students', studentSchema);