const User = require("../models/User");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const bcrypt = require("bcryptjs");
const { paginate } = require("../utils/Helpers");
const path = require("path");
const deleteFile = require("../utils/File");

const getProfile = async function (req, res, next) {
    try {
        const user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            avatar: req.user.avatar,
            role: req.user.role,
            gender: req.user.gender,
            city: req.user.city,
            isVerified: req.user.isVerified
        };

        return res
            .status(Constants.STATUSCODE.SUCCESS)
            .json(Jsend.success(user));

    } catch (err) {
        next(err);
    }
};


const updateProfile = async function (req, res, next) {
    try {

        const user = req.user;
        const password = req.body.password;

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(Constants.STATUSCODE.BAD_REQUEST)
                .json(Jsend.fail({ password: "Password is incorrect" }));
        }

        const allowedFields = [
            'name',
            'email',
            'phone',
            'gender',
            'city'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    city: user.city,
                    role: user.role,
                    isVerified: user.isVerified
                }
            })
        );

    } catch (error) {
        next(error);
    }
};

const updatePassword = async function (req, res, next) {
    try {

        const user = req.user;
        const { oldPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
                Jsend.fail({
                    message: "Old password is incorrect"
                })
            );
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "Password updated successfully"
            })
        );

    } catch (error) {
        next(error);
    }
};


const updateUserRole = async function (req, res, next) {
    try {

        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({
                    message: "User not found"
                })
            );
        }

        if (role === user.role) {
            return res.status(Constants.STATUSCODE.SUCCESS).json(
                Jsend.success({
                    message: "User already has this role"
                })
            );
        }

        user.role = role;
        await user.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "User role updated successfully"
            })
        );

    } catch (error) {
        next(error);
    }
};


const getUsers = async function (req, res, next) {
    try {

        const { page, limit, skip } = paginate(req);

        const users = await User
            .find()
            .select("-password -__v")
            .skip(skip)
            .limit(limit);

        const countDocs = await User.countDocuments();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                users,
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

const updateAvatar = async function (req, res, next) {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const user = req.user;

        // delete old avatar
        if (user.avatar) {
            const oldPath = path.join("uploads", "avatars", user.avatar);
            deleteFile(oldPath);
        }

        user.avatar = req.file.filename;

        await user.save();

        return res.json({
            message: "Avatar updated successfully",
            avatar: `/uploads/avatars/${user.avatar}`
        });

    } catch (error) {
        next(error);
    }
};

const viewUserProfile = async function (req, res, next) {
    try {

        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({
                    message: "User not found"
                })
            );
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                user
            })
        );

    } catch (error) {
        next(error);
    }
};

const deleteUser = async function (req, res, next) {
    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json({
                status: "fail",
                message: "User not found"
            });
        }

        // delete avatar if exists
        if (user.avatar) {
            const avatarPath = path.join("uploads", "avatars", user.avatar);
            deleteFile(avatarPath);
        }

        await User.findByIdAndDelete(id);

        return res.status(Constants.STATUSCODE.SUCCESS).json({
            status: "success",
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePassword,
    updateUserRole,
    getUsers,
    updateAvatar,
    viewUserProfile,
    deleteUser,
};