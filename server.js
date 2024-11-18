const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '')));

// Add this route to serve your HTML files
app.get('/:page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '', `${req.params.page}.html`));
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/school_bus_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Student Schema
const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    class: String,
    busStop: String,
    studentId: { type: String, unique: true },
    busPassId: { type: String, unique: true },
    address: {
        line1: String,
        line2: String,
        city: String,
        zipCode: String
    },
    parentInfo: {
        fatherName: String,
        fatherPhone: String,
        motherName: String,
        motherPhone: String
    },
    accountInfo: {
        username: { type: String, unique: true },
        password: String // Only hashed password is stored
    }
});

const Student = mongoose.model('Student', studentSchema);

// Store temporary registration data
let temporaryRegistrationData = new Map();

// Registration endpoint - Step 1
app.post('/api/register/step1', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            class: studentClass,
            busStop,
            studentId,
            busPassId,
            addressLine1,
            addressLine2,
            city,
            zipCode
        } = req.body;

        // Validate student ID and bus pass ID uniqueness
        const existingStudent = await Student.findOne({
            $or: [
                { studentId: studentId },
                { busPassId: busPassId }
            ]
        });

        if (existingStudent) {
            return res.status(400).json({
                error: 'Student ID or Bus Pass ID already exists'
            });
        }

        // Generate a temporary ID for this registration
        const tempId = Date.now().toString();

        // Store in temporary storage
        temporaryRegistrationData.set(tempId, {
            firstName,
            lastName,
            class: studentClass,
            busStop,
            studentId,
            busPassId,
            address: {
                line1: addressLine1,
                line2: addressLine2,
                city,
                zipCode
            }
        });

        res.json({ 
            message: 'Step 1 completed successfully',
            tempId: tempId 
        });
    } catch (error) {
        console.error('Step 1 error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Registration endpoint - Step 2 (Final)
app.post('/api/register/step2', async (req, res) => {
    try {
        const {
            tempId,
            fatherName,
            fatherPhone,
            motherName,
            motherPhone,
            username,
            password,
            confirmPassword
        } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: 'Password and confirm password do not match'
            });
        }

        // Get step 1 data
        const step1Data = temporaryRegistrationData.get(tempId);
        if (!step1Data) {
            return res.status(400).json({ error: 'Registration session expired or invalid' });
        }

        // Check if username already exists
        const existingUsername = await Student.findOne({
            'accountInfo.username': username
        });

        if (existingUsername) {
            return res.status(400).json({
                error: 'Username already exists'
            });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Combine step 1 and step 2 data
        const studentData = {
            ...step1Data,
            parentInfo: {
                fatherName,
                fatherPhone,
                motherName,
                motherPhone
            },
            accountInfo: {
                username,
                password: hashedPassword
            }
        };

        // Create new student record
        const student = new Student(studentData);
        await student.save();

        // Clear temporary data
        temporaryRegistrationData.delete(tempId);

        res.json({
            message: 'Registration completed successfully',
            studentId: student._id
        });
    } catch (error) {
        console.error('Step 2 error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const student = await Student.findOne({
            'accountInfo.username': username
        });

        if (!student) {
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        // Check password
        const validPassword = await bcryptjs.compare(
            password,
            student.accountInfo.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        res.json({
            message: 'Login successful',
            studentId: student._id
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
