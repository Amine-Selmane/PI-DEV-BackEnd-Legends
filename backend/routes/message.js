const express = require("express");
const { getMessages, sendMessage } = require("../controller/message.controller.js");
const midd = require("../middlware/protectRoute.js");

const router = express.Router();

// router.get("/:id", protectRoute, getMessages());
// router.post("/send/:id", protectRoute, sendMessage);
router.route('/:id').get(midd.protectRoute,getMessages);
router.route('/Send/:id').post(midd.protectRoute,sendMessage);



module.exports = router;
