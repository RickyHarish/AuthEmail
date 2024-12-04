require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const dns = require('dns');
const path = require('path');
dns.setDefaultResultOrder('ipv4first');



// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
// Serve static files
app.use(express.static(path.join(__dirname, 'client/build')));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Catch-all handler for React routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port ${port}...`));
