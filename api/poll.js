"use strict";
const AWS = require("aws-sdk");
const uuid = require("uuid");

const { get_item, get_bulk, create_item, update_item } = require('./database')

AWS.config.update({
  region: "af-south-1",
});

const createReturn = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify(message),
  };

}

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
  const Item = {
    id,
    question: eventBody.question,
    answers: eventBody.answers,
    time: new Date().getTime(),
  }
  const result = await create_item(Item);
  return createReturn(200, id)

};
module.exports.get_poll = async (event) => {
  const result = await get_item(event.pathParameters.id);
  return createReturn(200, result)
};

module.exports.get_polls = async (event) => {
  const result = await get_bulk(10);
  return createReturn(200, result)
};
module.exports.vote = async event => {
  const eventBody = JSON.parse(event.body);
  const vote = eventBody.vote;
  const id = event.pathParameters.id;
  const update = {
    Key: {
      id
    },
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: 'ADD ' + vote + ' :inc',
    ExpressionAttributeValues: { ':inc': 1 },
    ReturnValues: 'UPDATED_NEW'
  }
  const result = await update_item(update)
  return createReturn(200, result)

}