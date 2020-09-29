"use strict";
const AWS = require("aws-sdk");
const { Console } = require("console");
const uuid = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
AWS.config.update({
  region: "af-south-1",
});

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
module.exports.create_poll = async (event) => {
  const eventBody = JSON.parse(event.body);
  const id = uuid.v1();
  var result = "";
  const poll = {
    id,
    question: eventBody.question,
    answers: eventBody.answers,
    time: new Date().getTime(),
  };
  const pollInfo = {
    TableName: process.env.POLL_TABLE,
    Item: poll,
  };
  console.log("Ading poll to DynamoDB");

  try {
    result = await dynamoDb.put(pollInfo).promise();
    console.log(result);
  } catch (err) {
    console.log("Problem Saving to DynamoDB");
    console.log(err);
    return {
      statusCode: 503,
      body: err,
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
