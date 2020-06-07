let router = require("express").Router();
const {
  findUserByID,
  login,
  register,
} = require("../controllers/UserController");

router.get("/:id", findUserByID);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
