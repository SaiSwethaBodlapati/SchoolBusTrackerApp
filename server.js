const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8080;
const DirectoryPath = path.join(__dirname,'./public');
const authRouter = require('./src/routers/authRouters.js');
const connect = require("./src/db/connectDB.js");

const server = express();

// Middleware
server.use(bodyParser.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(DirectoryPath));

server.use('/auth', authRouter);

connect().then(() => {
    try {
		server.listen(port, () => {
			console.log(`Server started at http://localhost:${port}`);
		});
	} catch (err) {
		console.log("Unable to connect to the database due to: ", err);
    }
});