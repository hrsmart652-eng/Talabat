const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");


const makePayment = async function (req, res, next) {
  try {

    const { order_id, method } = req.body;

    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({ message: "Order not found" })
      );
    }

    // check if payment already exists
    const existingPayment = await Payment.findOne({ order_id });

    if (existingPayment) {
      return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
        Jsend.fail({
          message: "Payment already exists for this order",
        })
      );
    }

    const payment = new Payment({
      order_id,
      method,
      status: method === "cash" ? "pending" : "paid",
      transaction_id: Date.now().toString(),
      paid_at: method === "cash" ? null : new Date(),
    });

    await payment.save();

    return res.status(Constants.STATUSCODE.CREATED).json(
      Jsend.success({
        message: "Payment recorded",
        payment,
      })
    );

  } catch (error) {
    next(error);
  }
};

const getPayment = async function (req, res, next) {
  try {

    const payment = await Payment.findById(req.params.id)
      .populate("order_id");

    if (!payment) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({ message: "Payment not found" }),
      );
    }

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({ payment }),
    );

  } catch (error) {
    next(error);
  }
};


const getPayments = async function (req, res, next) {
  try {

    const { page, limit, skip } = paginate(req);

    const payments = await Payment.find()
      .populate("order_id")
      .skip(skip)
      .limit(limit);

    const countDocs = await Payment.countDocuments();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        payments,
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


const updatePaymentStatus = async function (req, res, next) {
  try {

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({ message: "Payment not found" }),
      );
    }

    payment.status = req.body.status;

    if (req.body.status === "paid") {
      payment.paid_at = new Date();
    }

    await payment.save();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        message: "Payment status updated",
        payment,
      }),
    );

  } catch (error) {
    next(error);
  }
};


const deletePayment = async function (req, res, next) {
  try {

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(Constants.STATUSCODE.NOT_FOUND).json(
        Jsend.fail({ message: "Payment not found" }),
      );
    }

    await payment.deleteOne();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        message: "Payment deleted",
      }),
    );

  } catch (error) {
    next(error);
  }
};

module.exports = {
  makePayment,
  getPayment,
  getPayments,
  updatePaymentStatus,
  deletePayment,
};