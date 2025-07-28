const router = require('express').Router({ mergeParams: true });
require('../../global_functions')

const passport = require('passport');
const {apiLimiter} = require('../../middleware/api-limit')
const validate = require('../../middleware/validate-schema')
const UserValidator = require('../../validator/user').userValidator

const UserService = require('../../services/users/user.service')

const userSignup = async (req, res) => {
  const [getUserError, getUser] = await to(UserService.getOneUser({email: req?.body?.email, isDeleted: false}));
  if(getUserError) return ReE(res, "Failed to validate user details", 422);
  if(getUser) return ReE(res, "User already exists!", 422);

  const[userError, createUser] = await to(UserService.userSignup(req.body))
  if(userError) return ReE(res, userError.message, 422);
  if(createUser) return ReS(res, createUser, 200);
}

const login = async (req, res) =>{
  let[loginError, loginSuccess] = await to(UserService.login(req.body))
  if(loginError) return ReE(res, loginError.message, 422);
  if(loginSuccess) return ReS(res, loginSuccess, 200);
}

const updateUserDetails = async(req,res) => {
  const [userUpdateErr, updateUser] = await to(UserService.updateUserDetails(req.body, req?.params?.id))
  if(userUpdateErr) return ReE(res, userUpdateErr.message, 422);
  if(updateUser) return ReS(res, updateUser, 200);
}

const getAllUser = async (req, res) =>{
  const[userError, userDetails] = await to(UserService.getAllUser())
  if(userError) return ReE(res, userError.message, 422);
  return ReS(res, userDetails, 200);
}

const getOneUser = async (req, res) =>{
  const[userError, userDetails] = await to(UserService.getOneUser({id: req?.params?.id, isDeleted: false}))
  if(userError) return ReE(res, userError.message, 422);
  if(!userDetails) return ReE(res, 'User Details not found', 422);
  return ReS(res, userDetails, 200);
}

const updatePassword = async(req,res) =>{
  const[passwordErr, updateUserPassword] = await to(UserService.updatePassword(req?.body))
  if(passwordErr) return ReE(res, passwordErr.message, 422);
  return ReS(res, updateUserPassword, 200);
}

const sendVerificationCode = async(req,res) =>{
  const[sendMailErr, sendMail] = await to(UserService.sendVerificationCode(req?.body))
  if(sendMailErr) return ReE(res, sendMailErr.message, 422);
  return ReS(res, sendMail, 200);
}

const verifyOtp = async(req,res) =>{
  const[verificationErr, verifyOtp] = await to(UserService.verifyOtp(req?.body))
  if(verificationErr) return ReE(res, verificationErr.message, 422);
  return ReS(res, verifyOtp, 200);
}

router.post('/login', apiLimiter, UserValidator.login, validate.validate, login)
router.post('/signup', UserValidator.userSignup, validate.validate, userSignup)
router.post('/sendmail', sendVerificationCode)
router.post('/verifyotp', verifyOtp)
router.post('/forgotpassword', updatePassword)
router.get('/:id', passport.authenticate('jwt', { session: false }), getOneUser)
router.put('/:id', passport.authenticate('jwt', { session: false }), updateUserDetails)
router.get('', passport.authenticate('jwt', { session: false }), getAllUser)

module.exports = {router, userSignup, login, updateUserDetails, getAllUser, getOneUser}