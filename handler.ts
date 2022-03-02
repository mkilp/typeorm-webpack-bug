import { APIGatewayProxyHandler } from "aws-lambda";
import {Database} from "./databaseHelper";
import {Connection} from "typeorm";
import {User} from "./entities/User";

const database = new Database();


export const hello: APIGatewayProxyHandler = async (event, context) => {
  let dbConn: Connection = await database.getConnection();
  console.log('connection established')
  let userRepository = dbConn.getRepository(User);
  const result = userRepository.find({
    select: ['id'],
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v2.0! Your function executed successfully!",
      context,
      event,
    }),
  };
};
