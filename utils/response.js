module.exports = function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}