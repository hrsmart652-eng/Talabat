var express = require("express");
var router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const UserController = require("../controllers/UserController");
const UserValidator = require("../middlewares/validators/UserValidator");
const upload = require("../middlewares/upload");



// logged user
router.get("/me", AuthMiddleware, UserController.getProfile);

router.patch(
  "/me",
  AuthMiddleware,
  UserValidator.updateProfile(),
  UserController.updateProfile,
);

router.patch(
  "/me/password",
  AuthMiddleware,
  UserValidator.updatePassword(),
  UserController.updatePassword,
);

router.patch(
  "/me/avatar",
  AuthMiddleware,
  upload.single("avatar"),
  UserValidator.updateAvatar(),
  UserController.updateAvatar,
);


router.get(
  "/:id",
  AuthMiddleware,
  UserValidator.getUserById(),
  UserController.viewUserProfile,
);

// admin
router.get(
  "/",
  AuthMiddleware,
  IsAdmin,
  UserValidator.getUsers(),
  UserController.getUsers,
);

router.patch(
  "/:id/role",
  AuthMiddleware,
  IsAdmin,
  UserValidator.updateUserRole(),
  UserController.updateUserRole,
);

router.delete(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  UserValidator.deleteUser(),
  UserController.deleteUser,
);

module.exports = router;
