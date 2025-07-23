const {param, query, body, checkExact} = require('express-validator')

const userValidator = {
    userSignup: [
        body("firstName")
        .isString().withMessage("First name must be a string").bail()
        .trim().isLength({ min: 2 }).withMessage("First name must be at least 2 characters"),

        body("lastName")
        .isString().withMessage("Last name must be a string").bail()
        .trim().isLength({ min: 1 }).withMessage("Last name must be at least 2 characters"),

        body("email")
            .isEmail().withMessage("Invalid email format").bail()
            .normalizeEmail(),

        body("password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
            .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
            .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
            .matches(/[0-9]/).withMessage("Password must contain at least one number")
            .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),

        body("phone").optional({ checkFalsy: true })
            .isNumeric().withMessage("Phone number must be numeric").bail()
            .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits"),

        body("countryCode").optional({ checkFalsy: true })
            .isInt().withMessage("Country code must be a number")
    ],
    
    login: [
        body("email")
            .isEmail().withMessage("Invalid email format")
            .normalizeEmail(), // Converts email to lowercase, removes unnecessary spaces

        body("password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
            .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
            .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
            .matches(/[0-9]/).withMessage("Password must contain at least one number")
            .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),

        param('*').isEmpty().withMessage("Invalid data! Params values are not allowed"),
        query('*').isEmpty().withMessage("Invalid data! Query params are not allowed"),
        checkExact(
            [],
            { message: 'Invalid Request, extra parameters are not allowed' }
        )
    ],

    updateUser: [
        body("firstName")
            .isString().withMessage("First name must be a string").bail()
            .trim().isLength({ min: 2 }).withMessage("First name must be at least 2 characters"),

        body("lastName")
            .isString().withMessage("Last name must be a string").bail()
            .trim().isLength({ min: 1 }).withMessage("Last name cannot be empty"),

        body("email")
            .isEmail().withMessage("Invalid email format").bail()
            .normalizeEmail(),

        body("password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
            .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
            .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
            .matches(/[0-9]/).withMessage("Password must contain at least one number")
            .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),

        body("bio").optional({ checkFalsy: true })
            .isString().withMessage("Last name must be a string"),

        body("phone")
            .isNumeric().withMessage("Phone number must be numeric").bail()
            .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits"),

        body("countryCode").optional({ checkFalsy: true })
            .isInt().withMessage("Country code must be a number")
    ],
    getOneUser: [
        param("id").isNumeric().withMessage("id must be a number"),
        body("*").isEmpty().withMessage("Invalid input! body valus are not allowed"),
        query("*").isEmpty().withMessage("Invalid input! query params are not allowed"),
        checkExact(
            [],
            { message: 'Invalid Request, extra parameters are not allowed' }
        )
    ]
}

module.exports.userValidator = userValidator