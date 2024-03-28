import mongodb from "mongodb";

const { MONGO_URI } = process.env;
const { MongoClient } = mongodb;
const client = new MongoClient(MONGO_URI);
const db = client.db("CarQuest");

const connectDB = async () => {
  try {
    let conn = await client.connect();
    if (conn) {
      return `Database Connected...`;
    }
  } catch (error) {
    return `Some error occured: ${error}`;
  }
};

export { connectDB, db };
