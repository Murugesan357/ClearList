const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

require('../../config/config');
require('../../global_functions');

const Users = require('../../models').users 
const Otp = require('../../models').otp
const CommonService = require('../../services/common.service');
const sendMail = require('../../utils/mailer').sendVerificationCode;

const userSignup = async (data) =>{
  if(data?.email){
    const [userError, createUser] = await to (Users.create(data));
    if(userError) return TE(userError.message);
    return createUser; 
  }
  else{
    return TE("Failed to signup user - Invalid user details");
  } 
  
}
module.exports.userSignup = userSignup;

const login = async (data) =>{
  const[userError, findUser] = await to (Users.findOne({
    where:{
      email: data?.email,
      isDeleted: false
    }
  }));
  if(userError) return TE(userError.message);
  if(findUser){
    let[errInUserInfo, userInfo] = await to(Users.prototype.storefrontcomparePassword(data.password, findUser.password));
    if(errInUserInfo){
      return TE(errInUserInfo.message);
    } 
    if(userInfo){
      const userVerifyToken = Object.assign({}, findUser);
      const token = CommonService.getJWT(userVerifyToken, CONFIG.jwt_encryption);
      delete  findUser.password
      return ({
        accessToken: CommonService.encryptDetails(token),
        user: findUser
      });
    }
  }
  else{
    return TE("User data not found!");
  }
}
module.exports.login = login;

const updateUserDetails = async(data, userId) =>{
  data = {...data, modifiedAt: new Date()}
  const [updateErr, updateUser] = await to(Users.update(data,{
    where:{
      id: userId,
      isDeleted: false
    },
    returning: true
  }))
  if(updateErr) return TE(updateErr.message);
  return updateUser[1]?.[0];
}
module.exports.updateUserDetails = updateUserDetails;

const getAllUser = async () =>{
  const[userError, getUsers] = await to (Users.findAll({
    where:{
      isDeleted: false
    }
  }));
  if(userError) return TE(userError.message);
  return getUsers ?? null;
}
module.exports.getAllUser = getAllUser;


const getOneUser = async (whereCondition) => {
  const [getOneUserErr, getOneUser] = await to (Users.findOne({
    where: whereCondition
  }));
  if(getOneUserErr) return TE(getOneUserErr.message);
  return getOneUser;
}
module.exports.getOneUser = getOneUser;

const updatePassword = async (data) => {
  const [err, user] = await to(Users.findOne({ where: { email: data?.email } }));
  if (err || !user) return TE('User not found');

  if(data?.currentPassword){
    const isMatch = await bcrypt.compare(data?.currentPassword, user.password);
    if (!isMatch) return TE('Invalid password');
  }
  user.password = data?.newPassword;
  await user.save();

  return { success: true, message: 'Password updated successfully' };
}
module.exports.updatePassword = updatePassword;

const sendVerificationCode = async({email}) =>{
  const [getOneUserErr, getOneUser] = await to (Users.findOne({
    where:{
      email
    }
  }));
  if(getOneUserErr || !getOneUser) return TE(`Failed to get User Details - Error: ${getOneUserErr??'User not found'}`);

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(verificationCode, 10);

  const [createErr, createOtp] = await to (Otp.create({
    userId: getOneUser.id,
    hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
  }));

  const [sendMailErr, sendMailOtp] = await to(sendMail(email,getOneUser?.firstName, verificationCode))
  if(sendMailErr) return TE(sendMailErr.message);
  if(sendMailOtp?.success) return sendMailOtp;
  return TE(sendMailOtp?.error);
}
module.exports.sendVerificationCode = sendVerificationCode;


const verifyOtp = async(data)=>{
    const { email, otp } = data;
    if (!email || !otp) return TE('Email and OTP are required');

    const [getUserErr, user] = await to (Users.findOne({
      where: {email}
    }));
    if(getUserErr || !getOneUser) return TE(`Failed to get User Details - Error: ${getUserErr??'User not found'}`);

    const [getOtpErr, otpRecord] = await to (Otp.findOne({
      where: { userId: user.id, isUsed: false },
      order: [['createdAt', 'DESC']]
    }))
    if(getOtpErr) return TE(getOtpErr.message);

    if (!otpRecord) return TE('OTP not found or already used');
    if (otpRecord.expiresAt < new Date()) return TE('OTP expired');

    const isMatch = await bcrypt.compare(otp, otpRecord.hashedOtp);
    if (!isMatch) return TE('Invalid OTP');

    otpRecord.isUsed = true;
    await otpRecord.save();

    return ({ isVerified: true, message: 'OTP verified successfully' });
}
module.exports.verifyOtp = verifyOtp;