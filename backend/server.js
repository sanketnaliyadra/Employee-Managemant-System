// Sanket Naliyadra --> server.js / EmployeeCreate.js


import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import { connectToDb, getDb } from "./db.js";
import cors from "cors";
import { ObjectId } from "mongodb";

let db;
const app = express();

app.use(express.json());

app.use(cors());

const employeeList = async () => {
  const employees = await db.collection("employees").find().toArray();
  return employees.map((employee) => {
    return {
      ...employee,
      id: employee._id.toString(),
    };
  });
};

const employeeAdd = async (_root, { employee }) => {
  employee.currentStatus = true;
  const result = await db.collection("employees").insertOne(employee);
  const savedResult = await db
    .collection("employees")
    .findOne({ _id: result.insertedId });
  return savedResult;
};

const employeeDelete = async (_root, { id }) => {
  try {
    console.log("Received id:", id);
    const result = await db
      .collection("employees")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (e) {
    console.log(e);
  }
};

const employeeById = async (_root, { id }) => {
  try {
    const employee = await db
      .collection("employees")
      .findOne({ _id: new ObjectId(id) });

    return employee;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const employeeEdit = async (_root, { id, updatedEmployee }) => {
  try {
    const result = await db
      .collection("employees")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedEmployee });

    if (result.modifiedCount === 1) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

const typeDefs = await readFile("./schema.graphql", "utf8");
const resolvers = {
  Query: {
    name: () => "TEAMS",
    employeeList: employeeList,
    employeeById: employeeById,
  },
  Mutation: {
    sendName: (_root, { name }) => {
      console.log(_root);
      return name + "!";
    },
    employeeAdd: employeeAdd,
    deleteEmployee: employeeDelete,
    employeeEdit: employeeEdit,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use("/graphql", expressMiddleware(apolloServer));

connectToDb((url, err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
      console.log("Graphql server started on http://localhost:3000/graphql");
      console.log("MongoDb started on url", url);
    });
    db = getDb();
  }
});
