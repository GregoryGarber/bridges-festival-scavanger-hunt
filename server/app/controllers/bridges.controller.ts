import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import dotenv from "dotenv";
import bridgesSchema from "../models/bridges.model";

dotenv.config();
const dbClient = new DynamoDBClient({ region: process.env.REGION });

const imageTableName = process.env.IMAGETABLENAME;
const userTableName = process.env.USERTABLENAME;

let cache: any = undefined;

async function signUp(req: Request, res: Response) {
  const { name } = req.body;

  const getItemParams = {
    TableName: userTableName,
    Key: marshall({
      name: name,
    }),
  };

  const getItemCommand = new GetItemCommand(getItemParams);

  dbClient.send(getItemCommand, (err: any, data: any) => {
    if (!err) {
      console.log(data);
      return res.status(500).send({ message: "user exists" });
    }
  });

  if (cache === undefined) await fetchImages(res);

  const user = { ...cache };
  user.name = name;

  putUser(res, user);
}

async function signIn(req: Request, res: Response) {
  const { name } = req.body;

  const getItemParams = {
    TableName: userTableName,
    Key: marshall({
      name: name,
    }),
  };

  const getItemCommand = new GetItemCommand(getItemParams);

  await dbClient.send(getItemCommand, (err: any, data: any) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
    }

    return res.status(200).send({ message: "Login Success", data: data });
  });
}

async function checkItem(req: Request, res: Response) {
  const { userData } = req.body;
  putUser(res, userData);
}

async function fetchImages(res: Response) {
  const getImagesParams = {
    TableName: imageTableName,
  };

  const getImagesCommand = new ScanCommand(getImagesParams);

  dbClient.send(getImagesCommand, (err: { message: any }, data: any) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: err.message, custom: "Dynamo Error", data: data });
    }
    cache = data.Items.map((item: any) => unmarshall(item));
  });
}

async function putUser(res: Response, user: any) {
  const { error, value } = bridgesSchema.validate(user);

  if (error !== undefined) {
    console.log(error);
    return res.status(500).send({ message: error, custom: "Schema Error" });
  }

  const putItemParams = {
    TableName: userTableName,
    Item: marshall(user),
  };

  const putItemCommand = new PutItemCommand(putItemParams);

  await dbClient.send(putItemCommand, (err: { message: any }, data: any) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: err.message, custom: "Dynamo Error", data: data });
    }
    console.log("Success - item added", data);
    return res
      .status(200)
      .send({ message: "User Added or Updated", data: data });
  });
}

const bridgesController = {
  signUp,
  signIn,
  checkItem,
};

export default bridgesController;
