const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let jwt = require("jsonwebtoken");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.findUserByID = (req, res, next) => {
  User.findById(req.params.id, "email username _id")
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Get succesful", user });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.register = (req, res, next) => {
  if (!req.body.username) {
    return res.status(400).json({ message: "Missing username field" });
  }

  if (!req.body.email) {
    return res.status(400).json({ message: "Missing email field" });
  }

  if (!req.body.password) {
    return res.status(400).json({ message: "Missing password field" });
  }

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const user = new User({
      password: hash,
      email: req.body.email,
      username: req.body.username,
    });

    user
      .save()
      .then((result) => {
        let token = jwt.sign(
          { email: result.email, id: result._id, username: result.username },
          process.env.JWT_SECRET
        );
        return res
          .status(200)
          .json({ success: true, message: "Auth succesful", token });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "Authentication details wrong.",
        });
      }

      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (!result) {
          return res.status(401).send({
            success: false,
            message: "Authentication details wrong.",
          });
        }

        let token = jwt.sign(
          { email: user.email, id: user._id, username: user.username },
          process.env.JWT_SECRET
        );
        return res
          .status(200)
          .json({ success: true, message: "Auth succesful", token });
      });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.uploadAvatar = (req, res, next) => {
  console.log(req.file);
  return cloudinary.uploader
    .upload(req.file.path)
    .then(({ url, secure_url }) => {
      return res.status(200).json({ url, secure_url });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
<<<<<<< HEAD

=======
>>>>>>> 5ea4e909d134d87fb73d60bdcb81f84285c8f220
