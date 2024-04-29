import mongoose from "mongoose";

export const connectDataBase = () => {
  try {
    mongoose.connect(process.env.DBMS_URL).then((result) => {
      console.log(`DATABASE CONNECTED ON HOST ${result.connection.host}`);
      console.log(`database name : ${result.connection.db.databaseName}`);
    });
  } catch (error) {
    console.log(error.message || "something went wrong!");
  }
};
