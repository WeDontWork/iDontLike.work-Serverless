'use strict';

const lib = require('./lib');

function sendResponse(error, body, event, cb) {
  if (typeof body !== 'string') {
    body = JSON.stringify(body);
  }
  const response = {
    statusCode: error ? 400 : 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ message: error || body }),
  };

  cb(null, response);
}

module.exports.createWFHReason = (event, context, callback) => {
  const body = JSON.parse(event.body);
  lib
    .handleReasonCreation(body)
    .then(result => {
      if (result.success) {
        return sendResponse(null, 'success', event, callback);
      }
      return sendResponse(result.error, result.error, event, callback);
    })
    .catch(err => {
      return sendResponse(err, err, event, callback);
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
