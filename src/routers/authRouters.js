const express = require('express')
const router = express.Router();
const authControllers = require('../controllers/authControllers.js')

router.get('/test', (req,res) => {
    res.send("School bus tracker app project");
})

router.post('/login', authControllers.login);
router.post('/register/:role', authControllers.register);
router.post('/sendOTP/:role', authControllers.sendOTP);
router.post('/validateOTP/:role', authControllers.validateOTP);

router.put('/resetPassword/:role', authControllers.resetPassword);

module.exports = router;