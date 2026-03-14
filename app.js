var express = require("express");
var ErrorHandler = require("./middlewares/ErrorHandler");

var authRouter = require("./routes/auth"); 
var userRouter = require("./routes/users");
var driverRouter = require("./routes/drivers");
var addressRoutes = require("./routes/address");
var restaurantRouter = require("./routes/restaurants");
var categoryRouter = require("./routes/categories");
var mealRouter = require("./routes/meals");
var reviewRouter = require("./routes/reviews");
var orderRouter = require("./routes/orders");
var paymentRouter = require("./routes/payments");

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/drivers', driverRouter);
app.use("/api/addresses", addressRoutes);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/meals", mealRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);

app.use(ErrorHandler);

module.exports = app;


