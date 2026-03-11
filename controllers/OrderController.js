const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Meal = require("../models/Meal");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");


const placeOrder = async function (req, res, next) {
  try {
    const { address_id, payment_method, items } = req.body;

    let total_price = 0;

    for (const item of items) {
      const meal = await Meal.findById(item.meal_id);

      if (!meal) {
        return res.status(Constants.STATUSCODE.NOT_FOUND).json(
          Jsend.fail({
            message: "Meal not found",
          }),
        );
      }

      total_price += meal.price * item.quantity;

      item.price = meal.price;
    }

    const order = new Order({
      user_id: req.user._id,
      address_id,
      payment_method,
      total_price,
    });

    await order.save();

    for (const item of items) {
      await OrderItem.create({
        order_id: order._id,
        meal_id: item.meal_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return res.status(Constants.STATUSCODE.CREATED).json(
      Jsend.success({
        message: "Order placed successfully",
        order,
      }),
    );
  } catch (error) {
    next(error);
  }
};


const trackOrder = async function (req, res, next) {
  try {

    const order = await Order.findById(req.params.id)
      .populate("user_id", "name email phone")
      .populate("driver_id", "name phone")
      .populate("address_id");

    if (!order) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({
          message: "Order not found",
        }),
      );
    }

    const items = await OrderItem
      .find({ order_id: order._id })
      .populate("meal_id", "name price image");

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        order,
        items
      }),
    );

  } catch (error) {
    next(error);
  }
};


const getOrders = async function (req, res, next) {
  try {

    const { page, limit, skip } = paginate(req);

    const orders = await Order.find()
      .populate("user_id", "name email phone")
      .populate("driver_id", "name phone")
      .populate("address_id")
      .skip(skip)
      .limit(limit);

    const countDocs = await Order.countDocuments();

    const ordersWithItems = [];

    for (const order of orders) {

      const items = await OrderItem
        .find({ order_id: order._id })
        .populate("meal_id", "name price image");

      ordersWithItems.push({
        order,
        items
      });
    }

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        orders: ordersWithItems,
        pagination: {
          total: countDocs,
          page,
          pages: Math.ceil(countDocs / limit),
          limit,
        },
      }),
    );

  } catch (error) {
    next(error);
  }
};


const assignDriver = async function (req, res, next) {
  try {
    const { driver_id } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({
          message: "Order not found",
        }),
      );
    }

    order.driver_id = driver_id;

    await order.save();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        message: "Driver assigned successfully",
        order,
      }),
    );
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async function (req, res, next) {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({
          message: "Order not found",
        }),
      );
    }

    await OrderItem.deleteMany({ order_id: order._id });

    await order.deleteOne();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        message: "Order deleted successfully",
      }),
    );

  } catch (error) {
    next(error);
  }
};

const updateStatus = async function (req, res, next) {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({
          message: "Order not found",
        }),
      );
    }

    order.status = req.body.status;

    await order.save();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        message: "Order status updated",
        status: order.status,
      }),
    );

  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  trackOrder,
  getOrders,
  assignDriver,
  deleteOrder,
  updateStatus
};