const Address = require("../models/Address");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");

const createAddress = async (req, res, next) => {
    try {
        const user_id = req.user._id; // middleware بيضيف req.user
        const { city, street, building, floor, notes, lat, lng } = req.body;

        const address = new Address({
            user_id,
            city,
            street,
            building,
            floor,
            notes,
            lat,
            lng
        });

        await address.save();

        return res.status(Constants.STATUSCODE.CREATED).json(
            Jsend.success({ address })
        );

    } catch (error) {
        next(error);
    }
};

const getUserAddresses = async (req, res, next) => {
    try {
        const user_id = req.user._id;
        const addresses = await Address.find({ user_id });

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({ addresses })
        );

    } catch (error) {
        next(error);
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const address = await Address.findOneAndUpdate(
            { _id: id, user_id: req.user._id },
            updates,
            { new: true }
        );

        if (!address) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Address not found" })
            );
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({ address })
        );

    } catch (error) {
        next(error);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        const { id } = req.params;

        const address = await Address.findOneAndDelete({
            _id: id,
            user_id: req.user._id
        });

        if (!address) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Address not found" })
            );
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({ message: "Address deleted successfully" })
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress
};