const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const getJWT = function (user, key) {
  //convert a string to integer
  let expiration_time = parseInt(CONFIG.jwt_expiration);
  //return the signature for given payload and secretkey
  return "Bearer " + jwt.sign(user, key, { expiresIn: expiration_time });
};
module.exports.getJWT = getJWT;


const decryptDetails = (data) => {
  if (data) {
    const bytes = CryptoJS.AES.decrypt(data.toString(), CONFIG.secret_key);
    const result = bytes.toString(CryptoJS.enc.Utf8).replace('|', /\\/g);
    // console.log('result', result);
    return result;
  } else {
    return null;
  }
}
module.exports.decryptDetails = decryptDetails;


const encryptDetails = (data, secretKey) => {
  if (data) {
    const text = CryptoJS.AES.encrypt(data.toString(), secretKey ? secretKey : CONFIG.secret_key).toString();
    return text.replace(/\\/g, '|');
  } else {
    return null;
  }
}
module.exports.encryptDetails = encryptDetails;

const getBase64String = async function (data) {
  console.log({ INFO: "getBase64String service called" });
  let encodeData;
  if (data) {
    encodeData = Buffer.from(data).toString('base64');
  }
  return encodeData;
}
module.exports.getBase64String = getBase64String;

const valueFromBase64 = async function (headers) {
  if (headers && headers.registration) {
    const base64Credentials = headers.registration.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const bytes = CryptoJS.AES.decrypt(credentials.toString(), CONFIG.secret_key);
    
    const result = bytes.toString(CryptoJS.enc.Utf8).replace('|', /\\/g);
    
    // const [email, password] = result.split(":");
    const [email, password] = credentials.split(":");
    return {
      email,
      password,
    };
  } else {
    return TE("Missing Registration header");
  }
};
module.exports.valueFromBase64 = valueFromBase64;