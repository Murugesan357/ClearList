const Sequelize = require('sequelize');
const Op = Sequelize.Op;

require('../../config/config');
require('../../global_functions');

const Users = require('../../models').users 
const UserCategoryMappings = require('../../models').userCategoryMappings 
const CommonService = require('../../services/common.service')


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


const userCategoryMapping = async (data) =>{
  const [categoryMappingErr, categoryMapping] = await to (UserCategoryMappings.create(data));
    if(categoryMappingErr) return TE(categoryMappingErr.message);
    return categoryMapping;
}