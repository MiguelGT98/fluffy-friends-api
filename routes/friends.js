let router = require("express").Router();
const {
  createFriend,
  getFriend,
  updateFriend,
  deleteFriend,
} = require("../controllers/FriendController");

const { checkToken } = require("../middlewares/AuthMiddleware");
const multer = require("../middlewares/MulterMiddleware");

router.post("/", [checkToken, multer.single("image")], createFriend);
router.get("/:id", [checkToken], getFriend);
router.patch("/:id", [checkToken, multer.single("image")], updateFriend);
router.delete("/:id", [checkToken], deleteFriend);

module.exports = router;
