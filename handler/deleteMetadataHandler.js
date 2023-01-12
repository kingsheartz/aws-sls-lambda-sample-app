'use strict';
const AWS = require('aws-sdk');

const { response } = require('../utils');

const metadataTable = process.env.METADATA_TABLE;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.deleteMetadata = (event, context, callback) => {
  const id = event.pathParameters.meta_store_id;

  const params = {
    Key: {
      meta_store_id: id
    },
    TableName: metadataTable
  }

  return db.delete(params)
    .promise()
    .then(() => callback(null, response(200, { message: 'Metadata ' + id + ' deleted successfully' })))
    .catch(err => response(null, response(err.statusCode, err + " :  Failed to delete metadata")))
}