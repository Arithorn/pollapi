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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
module.exports.create_poll = async (event) => {
  const eventBody = event.body; //JSON.parse(event.body);
  const id = uuid.v1();
  const poll = {
    id,
    question: eventBody.question,
    answers: eventBody.answers,
    time: new Date().getTime(),
  };
  const pollInfo = {
    TableName: process.env.POLL_TABLE,
    Item: { id: "1234", question: "test" },
  };
  console.log("Ading poll to DynamoDB");
  dynamoDb
    .put(pollInfo)
    .promise()
    .then((data) => {
      console.log("Fuck");
      console.log(pollInfo);
      return {
        statusCode: 200,
        body: data,
      };
    })
    .error((err) => {
      console.error(err);
      return {
        statusCode: 503,
        body: err,
      };
    });
};

// module.exports.movie = async (event) => {
//   var docClient = new AWS.DynamoDB.DocumentClient();

//   var table = "pollapi-service-dev";

//   var year = 2015;
//   var title = "The Big New Movie";

//   var params = {
//     TableName: table,
//     Item: {
//       year: year,
//       title: title,
//       info: {
//         plot: "Nothing happens at all.",
//         rating: 0,
//       },
//     },
//   };

//   console.log("Adding a new item...");
//   docClient.put(params, function (err, data) {
//     if (err) {
//       console.error(
//         "Unable to add item. Error JSON:",
//         JSON.stringify(err, null, 2)
//       );
//     } else {
//       console.log("Added item:", JSON.stringify(data, null, 2));
//     }
//   });
// };
