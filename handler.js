'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid'); //1.9K (gzipped: 818)

const metadataTable = process.env.POSTS_TABLE;

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}

function sortByDate(a, b) {
  if (a.createdAt > b.createAt) {
    return -1;
  } else return 1;
}

module.exports.storeMetadata = (event, context, callback) => {
  if (!event || !event.body) {
    return callback(null, response(400, { error: 'Request body is incomplete' }))
  }

  const reqBody = JSON.parse(event.body);

  const metadata = {
    meta_store_id: uuid.v4(),
    createAt: new Date().getMilliseconds(),
    data: reqBody
  };

  return db.put({
    TableName: metadataTable,
    Item: metadata,
  }).promise().then(() => {
    callback(null, response(201, metadata))
  }).catch(err => response(null, response(err.statusCode, err + " : Metadata is failed to store")))
}

module.exports.fetchAllMetadata = (event, context, callback) => {
  const querystring = event.queryStringParameters;
  const limit = querystring.limit || 10;
  const offset = querystring.offset || 0;
  const params = {
    TableName: metadataTable,
    Limit: limit
  }

  return db.scan(params)
    .promise()
    .then(res => {
      callback(null, response(200, res.Items.sort(sortByDate)))
    }).catch(err => response(null, response(err.statusCode, err + " :  Failed to retrieve metadata")))
}

module.exports.fetchMetadata = (event, context, callback) => {
  const id = event.pathParameters.meta_store_id;

  const params = {
    Key: {
      meta_store_id: id
    },
    TableName: metadataTable
  }

  return db.get(params)
    .promise()
    .then(res => {
      if (res.Item) callback(null, response(200, res.Item))
      else callback(null, response(404, { error: 'Metadata not found' }))
    }).catch(err => response(null, response(err.statusCode, err + " :  Failed to retrieve metadata")))
}

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
