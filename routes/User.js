const express = require('express');
const router = express.Router();
const {registerUser,loginUser,refresh,logout} = require('../controllers/User');

router.route('/register')
.post(registerUser);

router.route('/login')
.post(loginUser);


router.route('/refresh')
.post(refresh);

router.route('/logout')
.get(logout);


module.exports = router;