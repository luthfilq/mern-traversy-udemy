const express = require('express');
const router = express.Router();
const { check, validationRequest, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route   GET api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6})
], async (req,res) => {
    console.log(req.body);

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // See if the user exists
        let user = await User.findOne({ email });

        if(user) {
            res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }


        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return jsonwebtoken

        res.send('User registered');

    } catch(err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;