"use strict";
const AWS = require("aws-sdk");

const tableSchema = require("../resources/tableSchema");

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

/**
 * DynamoDB Tables
 */
const metadataTable = process.env.METADATA_TABLE;
const studyTable = process.env.STUDY_TABLE;
const seriesTable = process.env.SERIES_TABLE;

/**
 * Method to filter out duplicate values from an array.
 *
 * @param {*} arr
 * @returns
 */
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

/**
 * Method to filter out data from JSON object with respect to given path.
 *
 * @param {*} obj
 * @param {*} path
 * @param {*} defaultValue
 * @returns
 */
function getValueFromJSONObject(obj, path, defaultValue) {
    var fullPath = path.replace(/\[/g, ".").replace(/]/g, "").split(".").filter(Boolean);

    return fullPath.every(everyFunc) ? obj : defaultValue;

    function everyFunc(step) {
        return !(step && (obj = obj[step]) === undefined);
    }
}

/**
 * Compare and sort given list of data.
 *
 * @param {*} path
 * @param {*} compareWith
 * @param {*} compareTo
 * @returns
 */
function compareList(path, compareWith, compareTo) {
    return getValueFromJSONObject(compareWith.metadata, path, "").localeCompare(
        getValueFromJSONObject(compareTo.metadata, path, "")
    );
}

/**
 * Get Table schema based on DICOM Level
 *
 * @param {*} params
 * @param {*} dicom_level
 */
function defineTable(params, dicom_level) {
    switch (dicom_level) {
        case "study":
            params.TableName = studyTable;
            break;
        case "series":
            params.TableName = seriesTable;
            break;
        case "instance":
            params.TableName = metadataTable;
            break;
    }
}

/**
 * Method to prepare filterExpression for Multiselect search.
 *
 * @param {*} queryParamKey
 * @param {*} multiSearchValues
 * @param {*} expressionAttributeValues
 * @param {*} filterExpression
 */
function filterForMultiSearch(
    queryParamKey,
    multiSearchValues,
    dicom_level,
    expressionAttributeValues,
    filterExpression
) {
    const filterExpressionForMultiSearch = [];
    multiSearchValues.forEach((item) => {
        const expression =
            "contains(" +
            tableSchema[tableSchema[queryParamKey].Keyword].Level[dicom_level].FilterExpression +
            item.replace(/\W/g, "") +
            ")";
        filterExpressionForMultiSearch.push(expression);
        expressionAttributeValues[
            tableSchema[tableSchema[queryParamKey].Keyword].ExpressionAttributeValues.Key + item.replace(/\W/g, "")
        ] = item;
    });
    filterExpression.push("(" + filterExpressionForMultiSearch.join(" OR ") + ")");
}

/**
 * Method to prepare filterExpression for date range filtering.
 *
 * @param {*} queryParamKey
 * @param {*} queryParamValue
 * @param {*} expressionAttributeValues
 */
function filterForDateRange(queryParamKey, queryParamValue, expressionAttributeValues) {
    queryParamValue.split("-").forEach((value, index) => {
        const dateKey =
            tableSchema[tableSchema[queryParamKey].Keyword].ExpressionAttributeValues["Key" + Number(index + 1)];
        expressionAttributeValues[dateKey] = value;
    });
}

/**
 * Method to prepare Filter Expression.
 *
 * @param {*} queryString
 * @param {*} dicom_level
 * @returns
 */
function prepareFilterExpression(queryString, dicom_level) {
    const params = {
        ProjectionExpression: "metadata",
    };
    defineTable(params, dicom_level);

    if (queryString == null) return params;
    let filterExpression = [];
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};

    Object.keys(queryString).forEach((query) => {
        if (tableSchema[query]) {
            let searchValue = queryString[query];
            if (tableSchema[query].Level[dicom_level].CaseInsensitive) {
                searchValue = searchValue.toUpperCase();
            }
            switch (tableSchema[query].SearchCriteria) {
                case "MultiSearch":
                    const multiSearchValues = searchValue.split(",");
                    filterForMultiSearch(
                        query,
                        multiSearchValues,
                        dicom_level,
                        expressionAttributeValues,
                        filterExpression
                    );
                    break;
                case "DateRange":
                    filterExpression.push(tableSchema[query].Level[dicom_level].FilterExpression);
                    filterForDateRange(query, searchValue, expressionAttributeValues);
                    break;
                case "Default":
                    filterExpression.push(tableSchema[query].Level[dicom_level].FilterExpression);
                    const defaultKeyName = tableSchema[query].ExpressionAttributeValues.Key;
                    expressionAttributeValues[defaultKeyName] = searchValue;
                    break;
                default:
                    break;
            }

            expressionAttributeNames = {
                ...expressionAttributeNames,
                ...tableSchema[query].Level[dicom_level].ExpressionAttributeNames,
            };
        }
    });

    // Setting Filters for filtering out the results.
    if (filterExpression.length !== 0) {
        params.FilterExpression = filterExpression.join(" AND ");
        params.ExpressionAttributeNames = expressionAttributeNames;
        params.ExpressionAttributeValues = expressionAttributeValues;
    }

    return params;
}

/**
 * Method to fetch List of Metadata.
 *
 * @param {*} params
 * @returns
 */
async function fetchMetadataListFromQuery(params) {
    let scanResults = [];
    let result;
    try {
        do {
            result = await db.scan(params).promise();
            result.Items.map((item) => scanResults.push(item));
            params.ExclusiveStartKey = result.LastEvaluatedKey;
        } while (result.LastEvaluatedKey);
    } catch (error) {
        throw new Error("Failed to fetch metadata.");
    }

    return scanResults;
}

/**
 * Method to Build Request for the Deletion of Metadata.
 *
 * @param {*} scanResults
 * @param {*} keyword
 * @param {*} pathToValue
 * @returns
 */
function deleteRequestBuilder(scanResults, keyword, pathToValue) {
    const deleteRequestForTable = [];

    scanResults.forEach((item, index) => {
        const Request = {};
        const DeleteRequest = {};
        const Key = {};
        Key[keyword] = getValueFromJSONObject(item.metadata, pathToValue, "");
        DeleteRequest.Key = Key;
        Request.DeleteRequest = DeleteRequest;
        deleteRequestForTable.push(Request);
    });

    return deleteRequestForTable;
}

/**
 * Method to sort list of data based on 'orderby' value in both ascending and descending manner.
 *
 * @param {*} scanResults
 * @param {*} orderby
 * @returns
 */
function sortMetadata(scanResults, orderby) {
    if (!orderby.split("-")[1]) {
        scanResults = scanResults.sort((a, b) => compareList(tableSchema[orderby].PathToValue, a, b));
    } else {
        scanResults = scanResults.sort((a, b) => compareList(tableSchema[orderby.split("-")[1]].PathToValue, b, a));
    }

    return scanResults;
}

/**
 * Method to paginate response list of data based on 'offset' and 'limit' value.
 *
 * @param {*} data
 * @param {*} limit
 * @param {*} offset
 * @returns
 */
function enablePagination(data, limit, offset) {
    let result = [];
    for (let index = offset; index < data.length && index < limit + offset; index++) {
        result.push(data[index]);
    }
    return result;
}

module.exports = {
    defineTable,
    removeDuplicates,
    prepareFilterExpression,
    fetchMetadataListFromQuery,
    deleteRequestBuilder,
    sortMetadata,
    enablePagination,
    getValueFromJSONObject,
};
