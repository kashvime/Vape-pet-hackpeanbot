const express = require('express');
const app = express();
const path = require('path');
const defaultPort = 3000
require('dotenv').config(); //this activates the ability to parse the .env file


//automatically parse any incoming requests into a JSON format
app.use(express.json());


//this section sets up the MongoDB connection
const { MongoClient, ServerApiVersion } = require("mongodb");

const DB_USERNAME = process.env.db_username;
const DB_PASSWORD = process.env.db_password;

const uri = "mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@vape-cluster.okno4.mongodb.net/?retryWrites=true&w=majority&appName=Vape-Cluster"



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

const database = client.db("Notepad");
const collection = database.collection("Users");

async function run() {
    try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // We don't want the connection to immediately close so we'll just pass for now.
      pass
    }
}
run().catch(console.dir);

//this section here handles all sorts of crashes and server terminations so that Mongodb shuts off gracefully.

async function gracefulShutdown(){
    await client.close();
    console.log("We are gracefully shutting down the server and the mongodb connection")
}

// This will handle kill commands, such as CTRL+C:
process.on('SIGINT', async ()=>{
    console.log("Recieved SIGINT, shutting down gracefully....")
    await gracefulShutdown()
    process.exit(0)
});
process.on('SIGTERM', async ()=>{
    console.log("Recieved SIGTERM, shutting down gracefully....")
    await gracefulShutdown()
    process.exit(0)
});
// process.on('SIGKILL', async ()=>{
//     console.log("Recieved SIGKILL, shutting down gracefully....")
//     await gracefulShutdown()
//     process.exit(0)
// });


// This will prevent dirty exit on code-fault crashes:
process.on('uncaughtException', async (err) => {
    console.error('Unhandled Exception:', err);
    await gracefulShutdown(); // Close resources like DB connections
    process.exit(1); // Exit with a failure code
});









app.listen(defaultPort, () => console.log("Backend is running on http://localhost:3000"));