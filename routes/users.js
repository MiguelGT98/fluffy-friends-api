let router = require("express").Router();
const {
  findUserByID,
  login,
  register,
  uploadAvatar,
  getUserDetails,
  updateUserDetails,
} = require("../controllers/UserController");

const { checkToken } = require("../middlewares/AuthMiddleware");
const multer = require("../middlewares/MulterMiddleware");

router.get("/", [checkToken], getUserDetails);
router.patch("/", [checkToken], updateUserDetails);
router.get("/:id", findUserByID);
router.post("/login", login);
router.post("/register", register);
router.post("/avatar", [checkToken, multer.single("avatar")], uploadAvatar);

module.exports = router;
