const express = require('express');
const router = express.Router();


// @route   GET api/users
// @desc    Register user
// @access  Public
router.post('/', (req,res) => {
    //res.send(req.body);
    console.log(req.body);
    res.send('User route');
});

module.exports = router;