import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

export async function connect() {
  const uri = process.env.MONGODB_URI!;
  const port = process.env.PORT!;

  mongoose.connect(uri, { autoIndex: true });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}!`);
    });
  });
}

connect();
