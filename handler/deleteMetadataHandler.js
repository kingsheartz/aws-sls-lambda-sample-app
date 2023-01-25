"use strict";
const AWS = require("aws-sdk");

const {
    removeDuplicates,
    prepareFilterExpression,
    getValueFromJSONObject,
    fetchMetadataListFromQuery,
    deleteRequestBuilder,
    response,
} = require("../utils");
const tableSchema = require("../resources/tableSchema");

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

/**
 * Method to reset the tables based on the connection exists (Study -> Series -> Instance).
 *
 * @param {*} scanResults
 * @param {*} keyword
 * @returns
 */
async function resetTable(scanResults, keyword) {
    let deleteRequest = [];

    // Check whether any other Instance left of the same.
    const responseList = scanResults.map((scanResult) => {
        return getValueFromJSONObject(scanResult.metadata, tableSchema[keyword].PathToValue, "");
    });
    const searchString = removeDuplicates(responseList).join(",");
    let query = {};
    query[tableSchema[keyword].Keyword] = searchString;
    const params = prepareFilterExpression(query, "instance");
    const results = await fetchMetadataListFromQuery(params);

    if (results.length === 1) {
        deleteRequest = deleteRequestBuilder(results, tableSchema[keyword].Keyword, tableSchema[keyword].PathToValue);
    }
    return deleteRequest;
}

/**
 * Method to batch delete instances based on the requested params.
 *
 * @param {*} params
 * @returns
 */
function deleteInstances(params) {
    return db
        .batchWrite(params)
        .promise()
        .then(() => response(200, { message: "Deleted successfully" }))
        .catch((err) => response(err.statusCode, err + " :  Failed to delete metadata"));
}

module.exports.deleteMetadata = async (event, context, callback) => {
    const partitionKey = event.pathParameters.instance_UID;
    const dicom_level = event.pathParameters.dicom_level;

    let query = {};
    let scanResults = [];
    const requestItems = {};
    let study = [];
    let series = [];
    let deleteRequestForSeries = [];
    let deleteRequestForStudy = [];

    if (dicom_level === "study") {
        query[tableSchema.StudyInstanceUID.Keyword] = partitionKey;
    } else if (dicom_level === "series") {
        query[tableSchema.SeriesInstanceUID.Keyword] = partitionKey;
    } else {
        query[tableSchema.SOPInstanceUID.Keyword] = partitionKey;
    }

    const params = prepareFilterExpression(query, "instance");
    try {
        scanResults = await fetchMetadataListFromQuery(params);

        if (scanResults.length === 0) {
            return callback(null, response(500, { message: "Instance not found" }));
        }
        deleteRequestForSeries = await resetTable(scanResults, "SeriesInstanceUID");
        deleteRequestForStudy = await resetTable(scanResults, "StudyInstanceUID");
    } catch (error) {
        return callback(null, response(500, { message: error.message }));
    }

    switch (dicom_level) {
        case "study":
            const deleteRequestForStudyTable = deleteRequestBuilder(
                scanResults,
                tableSchema.StudyInstanceUID.PrimaryKey,
                tableSchema.StudyInstanceUID.PathToValue
            );
            requestItems.study = deleteRequestForStudyTable;
        /* falls through */
        case "series":
            const deleteRequestForSeriesTable = deleteRequestBuilder(
                scanResults,
                tableSchema.SeriesInstanceUID.PrimaryKey,
                tableSchema.SeriesInstanceUID.PathToValue
            );
            requestItems.series = deleteRequestForSeriesTable;
        /* falls through */
        case "instance":
            const deleteRequestForMetadataTable = deleteRequestBuilder(
                scanResults,
                tableSchema.SOPInstanceUID.PrimaryKey,
                tableSchema.SOPInstanceUID.PathToValue
            );
            requestItems.metadata = deleteRequestForMetadataTable;
            requestItems.series = [...series, ...deleteRequestForSeries];
            requestItems.study = [...study, ...deleteRequestForStudy];
            break;

        default:
            break;
    }
    params["RequestItems"] = requestItems;

    studyRequestCount = params.RequestItems.study.length;
    seriesRequestCount = params.RequestItems.series.length;
    instanceRequestCount = params.RequestItems.metadata.length;

    if (studyRequestCount + seriesRequestCount + instanceRequestCount > 25) {
        let alternativeParams = {};
        let alternativeRequestItems = {};
        let alternativeMetadata = [];

        if (studyRequestCount + seriesRequestCount < 25) {
            alternativeParams.alternativeRequestItems["study"] = params.RequestItems.study;
            alternativeParams.alternativeRequestItems["series"] = params.RequestItems.series;
            deleteInstances(alternativeParams);

            if (instanceRequestCount > 25) {
                do {
                    alternativeParams = {};
                    alternativeRequestItems = {};
                    alternativeMetadata = [];
                    for (let count = 0; count < 25; count++) {
                        alternativeMetadata.push(params.RequestItems.metadata[count]);
                    }
                    params.RequestItems.metadata = metadata.slice(24, instanceRequestCount);
                    alternativeRequestItems["metadata"] = alternativeMetadata;
                    alternativeParams["RequestItems"] = alternativeRequestItems;
                    deleteInstances(alternativeParams);
                } while (metadata.length > 0);
            } else {
                alternativeParams.metadata = params.metadata;
                deleteInstances(alternativeParams);
            }
        } else {
            alternativeParams.alternativeRequestItems["study"] = params.RequestItems.study;
            deleteInstances(alternativeParams);

            if (params.RequestItems.series.length > 25) {
                do {
                    alternativeParams = {};
                    alternativeRequestItems = {};
                    let alternativeSeries = [];
                    for (let count = 0; count < 25; count++) {
                        alternativeSeries.push(params.RequestItems.series[count]);
                    }
                    params.RequestItems.series = series.slice(24, seriesRequestCount);
                    alternativeRequestItems["series"] = alternativeSeries;
                    alternativeParams["RequestItems"] = alternativeRequestItems;
                    deleteInstances(alternativeParams);
                } while (series.length > 0);

                do {
                    alternativeParams = {};
                    alternativeRequestItems = {};
                    alternativeMetadata = [];
                    for (let count = 0; count < 25; count++) {
                        alternativeMetadata.push(params.RequestItems.metadata[count]);
                    }
                    params.RequestItems.metadata = metadata.slice(24, instanceRequestCount);
                    alternativeRequestItems["metadata"] = alternativeMetadata;
                    alternativeParams["RequestItems"] = alternativeRequestItems;
                    deleteInstances(alternativeParams);
                } while (metadata.length > 0);
            } else {
                alternativeParams.metadata = params.metadata;
                deleteInstances(alternativeParams);
            }
        }
    } else {
        return deleteInstances(params);
    }
};
