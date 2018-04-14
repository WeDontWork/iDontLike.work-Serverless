'use strict';

const aws = require('aws-sdk');

module.exports = function({ bucketName, fileName }) {
  const s3 = new aws.S3();
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  let __date = '';

  return new Promise((resolve, reject) => {
    s3
      .getObject(params, function(err, data) {
        if (err) return reject(err);
      })
      .createReadStream()
      .on('data', data => {
        __date += data;
      })
      .on('end', () => {
        resolve(__date);
      })
      .on('error', err => {
        reject(err);
      });
  });
};
