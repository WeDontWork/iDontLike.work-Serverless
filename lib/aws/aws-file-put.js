'use strict';

const aws = require('aws-sdk');

module.exports = function({ bucketName, fileName, data }) {
  const s3 = new aws.S3();
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: data,
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};
