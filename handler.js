'use strict';

const lib = require('./lib');

module.exports.createWFHReason = (event, context, callback) => {
  const body = JSON.parse(event.body);
  lib
    .handleReasonCreation(body)
    .then(result => {
      if (result.success) {
        return callback(null, JSON.stringify({ success: true }));
      }
      return callback(result.error, null);
    })
    .catch(err => {
      return callback(err, null);
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
