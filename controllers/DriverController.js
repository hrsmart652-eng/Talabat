const DriverProfile = require("../models/Driver");
const User = require("../models/User");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");


const getMyDriverProfile = async function (req, res, next) {
    try {
        const user = req.user;
        const profile = await DriverProfile.findOne({ user_id: user._id });

        if (!profile) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Driver profile not found" })
            );
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                    gender: req.user.gender,
                    city: req.user.city,
                    isVerified: user.isVerified,
                },
                driverProfile: profile
            })
        );

    } catch (error) {
        next(error);
    }
};



const createDriverProfile = async function (req, res, next) {
    try {

        if (req.user.role !== "driver") {
            return res.status(Constants.STATUSCODE.FORBIDDEN).json(
                Jsend.fail({
                    message: "User is not a driver"
                })
            );
        }

        const existing = await DriverProfile.findOne({ user_id: req.user._id });

        if (existing) {
            return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
                Jsend.fail({
                    message: "Driver profile already exists"
                })
            );
        }

        const profile = new DriverProfile({
            user_id: req.user._id,
            vehicle_type: req.body.vehicle_type,
            vehicle_number: req.body.vehicle_number,
            current_lat: req.body.current_lat,
            current_lng: req.body.current_lng
        });

        await profile.save();

        return res.status(Constants.STATUSCODE.CREATED).json(
            Jsend.success({
                message: "Driver profile created",
                profile
            })
        );

    } catch (error) {
        next(error);
    }
};



const updateDriverProfile = async function (req, res, next) {
    try {

        const profile = await DriverProfile.findOne({ user_id: req.user._id });

        if (!profile) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({
                    message: "Driver profile not found"
                })
            );
        }

        const allowedFields = [
            "vehicle_type",
            "vehicle_number",
            "current_lat",
            "current_lng",
            "is_available"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                profile[field] = req.body[field];
            }
        });

        await profile.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "Driver profile updated",
                profile
            })
        );

    } catch (error) {
        next(error);
    }
};



const getDrivers = async function (req, res, next) {
    try {

        const { page, limit, skip } = paginate(req);

        const drivers = await DriverProfile
            .find()
            .populate("user_id", "name email phone avatar")
            .skip(skip)
            .limit(limit);

        const countDocs = await DriverProfile.countDocuments();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                drivers,
                pagination: {
                    total: countDocs,
                    page,
                    pages: Math.ceil(countDocs / limit),
                    limit
                }
            })
        );

    } catch (error) {
        next(error);
    }
};



module.exports = {
    getMyDriverProfile,
    createDriverProfile,
    updateDriverProfile,
    getDrivers
};