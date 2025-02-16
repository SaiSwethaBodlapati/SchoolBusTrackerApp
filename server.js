const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8080;
const DirectoryPath = path.join(__dirname,'./public');
const authRouter = require('./src/routers/authRouters.js');
const adminRouter = require('./src/routers/adminRouters.js');
const connect = require("./src/db/connectDB.js");

const server = express();

// Middleware
server.use(bodyParser.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));

server.use("/", express.static(path.join(__dirname, "./public")));
server.use("/driver", express.static(path.join(__dirname, "./driver")));
server.use("/admin", express.static(path.join(__dirname, "./admin")));


server.use('/auth', authRouter);
server.use('/admin', adminRouter);

connect().then(() => {
    try {
		server.listen(port, () => {
			console.log(`Server started at http://localhost:${port}`);
		});
	} catch (err) {
		console.log("Unable to connect to the database due to: ", err);
    }
});