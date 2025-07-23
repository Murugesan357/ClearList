const pe = require('parse-error');

ReE = async function (res, err, code) {
  if (typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message;
  }
  console.log('check error', err);
  if (typeof code !== 'undefined') res.statusCode = code;
  return res.json({ success: false, error: err });
}

ReS = function (res, data, code) { 
  let send_data = { success: true };
  
  if (typeof data == 'object') {
    send_data = Object.assign(data, send_data);
  }

  if (typeof code !== 'undefined') res.statusCode = code;
  return res.json(send_data);
};

to = function (promise) {
  return promise
      .then(data => {
          return [null, data];
      }).catch(err =>
          [pe(err)]
      );
}

TE = function (err_message, log) {
  if (log === true) {
    console.error(err_message);
  }

  throw new Error(err_message);
}

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
