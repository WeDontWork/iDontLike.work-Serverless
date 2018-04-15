'use strict';

const getFileFromS3 = require('./aws/aws-file-getter');
const writeFileToS3 = require('./aws/aws-file-put');

module.exports = async function() {
  const fileName = `wfh-reasons-${process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV}.json`;
  const bucketName = 'idontlikework';

  let currentContent, writeResult;
  try {
    currentContent = JSON.parse(await getFileFromS3({ bucketName, fileName }));
  } catch (err) {
    return { success: false, error: err };
  }

  console.log('Current Content', currentContent);

  return { success: true, error: null, message: currentContent };
};
