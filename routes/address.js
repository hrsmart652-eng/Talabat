const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/AddressController");
const AddressValidator = require("../middlewares/validators/AddressValidator");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.use(AuthMiddleware);

router.post("/", AddressValidator.create(), AddressController.createAddress);
router.get("/", AddressController.getUserAddresses);
router.put("/:id", AddressValidator.update(), AddressController.updateAddress);
router.delete("/:id", AddressValidator.delete(), AddressController.deleteAddress);

module.exports = router;