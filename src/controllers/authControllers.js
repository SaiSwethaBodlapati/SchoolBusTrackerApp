const bcrypt = require('bcrypt');
const studentModel = require('../models/studentModel.js')


 const register = async (req, res) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new studentModel({
            ...req.body,
            password: hashedPassword,
        });

        await user.save();
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: 'Failed to register user. Username may already exist.' });
    }
};

const login =  async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await studentModel.findOne({ username });
        if (user) {
            const isPasswordValid = bcrypt.compare(password, user.password);
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
};

// Password Reset API
const resetPassword =  async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ error: 'Username and new password are required.' });
    }

    try {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const user = await studentModel.findOneAndUpdate(
            { username: username },
            { password: hashedPassword },
            { new: true } 
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
};


module.exports = {
    register,
    login,
    resetPassword
}