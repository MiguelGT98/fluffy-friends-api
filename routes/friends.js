let router = require("express").Router();
const {
  createFriend,
  getFriend,
  getMyFriends,
  getFriends,
  updateFriend,
  deleteFriend,
} = require("../controllers/FriendController");

const { checkToken } = require("../middlewares/AuthMiddleware");
const multer = require("../middlewares/MulterMiddleware");

router.post("/", [checkToken], createFriend);
router.get("/self", [checkToken], getMyFriends);
router.get("/:id", [checkToken], getFriend);
router.patch("/:id", [checkToken], updateFriend);
router.delete("/:id", [checkToken], deleteFriend);
router.get("/", [checkToken], getFriends);

module.exports = router;
