const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.POLL_TABLE
AWS.config.update({
    region: "af-south-1",
});


module.exports.get_item = id => {
    const Query = {
        TableName,
        Key: {
            id
        },
    };
    return dynamoDb.get(Query).promise().then(result => {
        return result.Item
    }).catch(err => console.log(err));

}

module.exports.get_bulk = limit => {
    return dynamoDb.scan({ TableName }).promise().then(result => {
        return result.Items
    }).catch(err => console.log(err))

}
module.exports.create_item = (Item) => {
    const Query = {
        TableName,
        Item
    };
    return dynamoDb.put(Query).promise().then(result => {
        return result.Item
    }).catch(err => console.log(err))

}
module.exports.update_item = (Update) => {
    const Query = { TableName, ...Update }
    console.log(Query)

    return dynamoDb.update(Query).promise().then(result => {
        return result
    }).catch(err => console.log(err))
}