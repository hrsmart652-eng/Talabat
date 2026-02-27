var express = require("express");
var router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");

const UserController = require("../controllers/UserController");
const UserValidator = require("../middlewares/validators/UserValidator");

const uploadAvatar = require("../middlewares/uploadAvatar");


// logged user
router.get("/me",
    AuthMiddleware,
    UserController.getProfile
);

router.patch("/me",
    AuthMiddleware,
    UserValidator.updateProfile(),
    UserController.updateProfile
);

router.patch("/me/password",
    AuthMiddleware,
    UserValidator.updatePassword(),
    UserController.updatePassword
);

router.patch("/me/avatar",
    AuthMiddleware,
    uploadAvatar.single("avatar"),
    UserValidator.updateAvatar(),
    UserController.updateAvatar
);


// admin
router.get("/",
    AuthMiddleware,
    IsAdmin,
    UserValidator.getUsers(),
    UserController.getUsers
);

router.patch("/:id/role",
    AuthMiddleware,
    IsAdmin,
    UserValidator.updateUserRole(),
    UserController.updateUserRole
);

module.exports = router;