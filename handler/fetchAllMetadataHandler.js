const {
    prepareFilterExpression,
    fetchMetadataListFromQuery,
    sortMetadata,
    enablePagination,
    response,
} = require("../utils");

module.exports.fetchAllMetadata = async (event, context, callback) => {
    const queryString = event.queryStringParameters;
    const dicom_level = event.pathParameters.dicom_level;

    if (!queryString || !queryString.limit || !queryString.offset || !queryString.orderby)
        return callback(null, response(400, { message: "Request format is incorrect" }));

    const params = prepareFilterExpression(queryString, dicom_level);
    let scanResults = [];
    try {
        scanResults = await fetchMetadataListFromQuery(params);
    } catch (error) {
        return callback(null, response(204, { message: error.message }));
    }
    var len = scanResults.length;
    scanResults = sortMetadata(scanResults, queryString.orderby);
    scanResults = enablePagination(scanResults, Number(queryString.limit), Number(queryString.offset));
    return callback(null, response(200, { count: len, result: scanResults }));
};
