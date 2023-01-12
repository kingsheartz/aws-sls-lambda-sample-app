'use strict';
const AWS = require('aws-sdk');

const { response } = require('../utils');

const metadataTable = process.env.METADATA_TABLE;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

/**
 * Method to prepare Filter Expression.
 * 
 * @param {*} queryString 
 * @returns 
 */
function prepareFilterExpression(queryString) {
    const limit = queryString.limit || 10;
    const action = queryString.action == null ? true : queryString.action;

    let filterExpression = [];
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    
    Object.keys(queryString).forEach((query) => {
        switch (query) {
            case 'title':
                filterExpression.push('#keyData.#keyTitle = :valueTitle');
                expressionAttributeNames['#keyTitle'] = query;
                expressionAttributeValues[':valueTitle'] = queryString.title;
                break;
            case 'id':
                filterExpression.push('#keyData.#keyUser.#keyId = :valueId');
                expressionAttributeNames['#keyUser'] = "user";
                expressionAttributeNames['#keyId'] = query;
                expressionAttributeValues[':valueId'] = queryString.id;
                break;
            default:
                break;
        }
    })

    const params = {
        TableName: metadataTable,
        ScanIndexForward: action,
        Limit: limit
    };

    if (filterExpression.length != 0) {
        expressionAttributeNames['#keyData'] = "data";
        params.FilterExpression = filterExpression.join(' AND ');
        params.ExpressionAttributeNames = expressionAttributeNames;
        params.ExpressionAttributeValues = expressionAttributeValues;
    }

    return params;
}

module.exports.fetchAllMetadata = (event, context, callback) => {
    const queryString = event.queryStringParameters;
    const lastItem = queryString.lastItem == null ? null : queryString.lastItem;

    const params = prepareFilterExpression(queryString);

    if (lastItem !== null && lastItem !== '') {
        params.ExclusiveStartKey = { meta_store_id: lastItem };
    }

    return db.scan(params)
        .promise()
        .then(res => {
            callback(null, response(200, { lastItem: res.LastEvaluatedKey, result: res.Items }

            ))
        }).catch(err => response(null, response(err.statusCode, err + ' :  Failed to retrieve metadata')))
}