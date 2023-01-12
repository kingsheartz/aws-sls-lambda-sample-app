'use strict';
const AWS = require('aws-sdk');

const { response } = require('../utils');

const metadataTable = process.env.METADATA_TABLE;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

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