import { body } from "express-validator";

/**
 * `registerValidation` and `loginValidation` are middleware functions that validate 
 * user input for registration and login forms using `express-validator`.
 * 
 * - `registerValidation`: Validates the name, email, password, and confirmPassword 
 *   fields for user registration.
 * - `loginValidation`: Validates the email and password fields for user login.
 * 
 * These validations ensure that inputs meet specific requirements before 
 * processing the registration or login request.
 */

export const registerValidation = [
  body("name")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 3 }).withMessage("Name must be atleast 3 characters"),

  body("email").isEmail().withMessage("Please enter a valid email address"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters"),
    
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];


export const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").isLength({min: 6}).withMessage("Password must be atleast 6 characters")
];