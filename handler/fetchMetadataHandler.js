"use strict";
const AWS = require("aws-sdk");

const { defineTable, response } = require("../utils");

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

module.exports.fetchMetadata = (event, context, callback) => {
    const partitionKey = event.pathParameters.instance_UID;
    const dicom_level = event.pathParameters.dicom_level;

    const params = {
        Key: {
            instance_UID: partitionKey,
        },
    };
    defineTable(params, dicom_level);

    return db
        .get(params)
        .promise()
        .then((res) => {
            if (res.Item) callback(null, response(200, res.Item));
            else callback(null, response(404, { error: "Metadata not found" }));
        })
        .catch((err) =>
            response(null, response(err.statusCode, err + " :  Failed to retrieve metadata"))
        );
};
