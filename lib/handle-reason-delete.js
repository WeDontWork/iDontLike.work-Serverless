'use strict';

const getFileFromS3 = require('./aws/aws-file-getter');
const writeFileToS3 = require('./aws/aws-file-put');

module.exports = async function(id) {
  id = Number(id);

  const fileName = `wfh-reasons-${process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV}.json`;
  const bucketName = 'idontlikework';

  let currentContent, writeResult;
  try {
    currentContent = JSON.parse(await getFileFromS3({ bucketName, fileName }));
  } catch (err) {
    return { success: false, error: err };
  }

  console.log('Current Content', currentContent);

  currentContent = currentContent.filter(elem => elem.id !== id);

  console.log('New content', currentContent);

  try {
    writeResult = await writeFileToS3({ bucketName, fileName, data: JSON.stringify(currentContent, null, 2) });
  } catch (err) {
    return { success: false, error: err };
  }

  return { success: true, error: null, message: currentContent };
};
