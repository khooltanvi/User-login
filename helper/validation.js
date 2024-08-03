const { check } = require('express-validator');

exports.loginValidator=[
     check('email','Enter valid Email').isEmail().normalizeEmail({
        gmail_remove_dots:true
     }),
     check('password','Password is required').not().isEmpty(),
     check('username','Username is required').not().isEmpty()
]