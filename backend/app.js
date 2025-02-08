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

const uri = "mongodb+srv://Databaseuser1:<db_password>@vape-cluster.okno4.mongodb.net/?retryWrites=true&w=majority&appName=Vape-Cluster"