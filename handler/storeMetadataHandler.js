'use strict';
const AWS = require('aws-sdk');
const uuid = require('uuid');

const { response } = require('../utils');

const metadataTable = process.env.METADATA_TABLE;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.storeMetadata = (event, context, callback) => {
  if (!event || !event.body) {
    return callback(null, response(400, { error: 'Request body is incomplete' }))
  }

  const reqBody = JSON.parse(event.body);

  const metadata = {
    meta_store_id: uuid.v4(),
    createAt: new Date().getTime(),
    data: reqBody
  };

  return db.put({
    TableName: metadataTable,
    Item: metadata,
  }).promise().then(() => {
    callback(null, response(201, metadata))
  }).catch(err => response(null, response(err.statusCode, err + " : Metadata is failed to store")))
}