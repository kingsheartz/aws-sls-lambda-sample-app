"use strict";
const AWS = require("aws-sdk");

const { response } = require("../utils");
const tableSchema = require("../resources/tableSchema");

const metadataTable = process.env.METADATA_TABLE;
const studyTable = process.env.STUDY_TABLE;
const seriesTable = process.env.SERIES_TABLE;
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const studyKeys = [
    tableSchema.PatientName.Tag,
    tableSchema.PatientID.Tag,
    tableSchema.AccessionNumber.Tag,
    tableSchema.StudyDescription.Tag,
    tableSchema.StudyInstanceUID.Tag,
    tableSchema.StudyDate.Tag,
    tableSchema.ModalitiesInStudy.Tag,
    tableSchema.Modality.Tag,
];

const seriesKeys = [
    tableSchema.Modality.Tag,
    tableSchema.SeriesDate.Tag,
    tableSchema.SeriesDescription.Tag,
    tableSchema.SeriesInstanceUID.Tag,
    tableSchema.StudyInstanceUID.Tag,
];

module.exports.storeMetadata = (event, context, callback) => {
    if (!event || !event.body) {
        return callback(null, response(400, { error: "Request body is incomplete" }));
    }
    try {
        const reqBody = JSON.parse(event.body);

        reqBody.forEach((metadata) => {
            metadata.createAt = new Date().getTime();

            const studyDataItems = {};
            studyKeys.forEach((item) => (studyDataItems[item] = metadata[item]));

            const study = {
                studyInstanceUID: metadata[tableSchema.StudyInstanceUID.Tag].Value[0],
                patientName: metadata[tableSchema.PatientName.Tag].Value[0].Alphabetic.toUpperCase(),
                studyDescription: metadata[tableSchema.StudyDescription.Tag].Value[0].toUpperCase(),
                createAt: new Date().getTime(),
                metadata: studyDataItems,
            };
            save(studyTable, study);

            const seriesDataItems = {};
            seriesKeys.forEach((item) => (seriesDataItems[item] = metadata[item]));
            const series = {
                seriesInstanceUID: metadata[tableSchema.SeriesInstanceUID.Tag].Value[0],
                seriesDescription: metadata[tableSchema.SeriesDescription.Tag].Value[0].toUpperCase(),
                createAt: new Date().getTime(),
                metadata: seriesDataItems,
            };
            save(seriesTable, series);

            const Instance = {
                sopInstanceUID: metadata[tableSchema.SOPInstanceUID.Tag].Value[0],
                createAt: new Date().getTime(),
                metadata: metadata,
            };
            save(metadataTable, Instance);
        });
        return callback(null, response(201, "Metadata  Stored"));
    } catch (err) {
        console.log("Error", err);
        return callback(null, response(err.statusCode, { error: "Metadata is failed to store" }));
    }
};

const save = (tableName, item) => {
    try {
        db.put({
            TableName: tableName,
            Item: item,
        })
            .promise()
            .then({});
        console.log("Success - item added or updated");
    } catch (err) {
        console.log("Error", err);
    }
};
