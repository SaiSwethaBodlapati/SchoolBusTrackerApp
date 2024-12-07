const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname))); // Serve static files

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/schoolbus', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
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
    password: String, // Password will be hashed
});

const User = mongoose.model('User', userSchema);

// Serve the homepage (root URL)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Registration API
app.post('/api/register', async (req, res) => {
    try {
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            ...req.body,
            password: hashedPassword,
        });

        await user.save();
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: 'Failed to register user. Username may already exist.' });
    }
});

// Login API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            // Compare the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                res.status(200).json({ message: 'Login successful!' });
            } else {
                res.status(401).json({ error: 'Invalid username or password.' });
            }
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// Password Reset API
app.post('/api/reset-password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ error: 'Username and new password are required.' });
    }

    try {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        const user = await User.findOneAndUpdate(
            { username: username }, // Find the user by username
            { password: hashedPassword }, // Update the password
            { new: true } // Return the updated document
        );

        if (user) {
            res.status(200).json({ message: 'Password updated successfully!' });
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'An error occurred while updating the password.' });
    }
});

// Serve other HTML files dynamically
app.get('/:page', (req, res) => {
    const { page } = req.params;
    const filePath = path.join(__dirname, `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
