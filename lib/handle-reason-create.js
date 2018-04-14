'use strict';

const getFileFromS3 = require('./aws/aws-file-getter');
const writeFileToS3 = require('./aws/aws-file-put');

module.exports = async function(body) {
  const fileName = `wfh-reasons-${process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV}.json`;
  const bucketName = 'idontlikework';

  let currentContent, writeResult;
  try {
    currentContent = JSON.parse(await getFileFromS3({ bucketName, fileName }));
  } catch (err) {
    return { success: false, error: err };
  }

  console.log('Current Content', currentContent);

  if (!currentContent[0].id) {
    for (var i = 0; i < currentContent.length; i++) {
      currentContent[i].id = i + 1;
    }
  }

  const existingReasons = currentContent.map(i =>
    i.text
      .toLowerCase()
      .trim()
      .replace(/\s/g, ''),
  );

  if (
    existingReasons.includes(
      body.reason
        .toLowerCase()
        .trim()
        .replace(/\s/g, ''),
    )
  ) {
    return { success: false, error: 'Already exists. Ignoring' };
  }

  currentContent.push({
    text: body.reason,
    id: currentContent.length + 2,
  });

  console.log('New content', currentContent);

  try {
    writeResult = await writeFileToS3({ bucketName, fileName, data: JSON.stringify(currentContent, null, 2) });
  } catch (err) {
    return { success: false, error: err };
  }

  return { success: true, error: null };
};
