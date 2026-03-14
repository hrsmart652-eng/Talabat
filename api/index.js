require('dotenv').config({override: true});
const app = require("../app");
const connectDB = require("../config/db");

connectDB()
.then (() => {
    console.log("Mongo Connected");
})
.catch (error => {
    console.error("Mongo connection failed", error);
})

module.exports = (req, res, next) => {
    return app(req, res, next);
}