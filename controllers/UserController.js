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
  const locale = req.headers["accept-language"] || "es";

  User.findById(req.params.id, "email username _id")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            locale === "es" ? "No se encontró al usuario" : "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: locale === "es" ? "Se encontró al usuario" : "User found",
        user,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message:
          locale === "es"
            ? "Ocurrió un error inesperado"
            : "An unexpected error happened",
      });
    });
};

exports.register = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  if (!req.body.username) {
    return res.status(400).json({
      message:
        locale === "es"
          ? "Campo de nombre de usuario es requerido"
          : "Missing username field",
    });
  }

  if (!req.body.email) {
    return res.status(400).json({
      message:
        locale === "es" ? "Campo de email es requerido" : "Missing email field",
    });
  }

  if (!req.body.password) {
    return res.status(400).json({
      message:
        locale === "es"
          ? "Campo de contraseña es requerido"
          : "Missing username field",
    });
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
        return res.status(200).json({
          success: true,
          message:
            locale === "es" ? "Registro exitoso" : "Register successfull",
          token,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error,
          message:
            locale === "es"
              ? "Ocurrió un error inesperado"
              : "An unexpected error happened",
        });
      });
  });
};

exports.login = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          success: false,
          message:
            locale === "es" ? "Credenciales incorrectas" : "Wrong credentials",
        });
      }

      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (!result) {
          return res.status(401).send({
            success: false,
            message:
              locale === "es"
                ? "Credenciales incorrectas"
                : "Wrong credentials",
          });
        }

        let token = jwt.sign(
          { email: user.email, id: user._id, username: user.username },
          process.env.JWT_SECRET
        );
        return res.status(200).json({
          success: true,
          message:
            locale === "es" ? "Inicio de sesión exitoso" : "Login successfull",
          token,
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message:
          locale === "es"
            ? "Ocurrió un error inesperado"
            : "An unexpected error happened",
      });
    });
};

exports.uploadAvatar = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  return cloudinary.uploader
    .upload(req.file.path)
    .then(({ url, secure_url }) => {
      return res.status(200).json({
        url,
        secure_url,
        message:
          locale === "es"
            ? "Avatar cambiado con éxito"
            : "Avatar changed successfully",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message:
          locale === "es"
            ? "Ocurrió un error inesperado"
            : "An unexpected error happened",
      });
    });
};

exports.getUserDetails = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  User.findById(
    req.decoded.id,
    "email username _id names lastNames phone avatar"
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: locale === "es" ? "Usuario no encontrado" : "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          locale === "es"
            ? "Datos del usuario recuperados con éxito"
            : "User details retreived successfully",
        user: { ...user._doc, created_at: user._id.getTimestamp() },
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message:
          locale === "es"
            ? "Ocurrió un error inesperado"
            : "An unexpected error happened",
      });
    });
};

exports.updateUserDetails = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  const { names, lastNames, phone, password, passwordConfirmation } = req.body;
  const newUser = {};

  if (password !== "" && password !== passwordConfirmation) {
    return res.status(400).json({
      message:
        locale === "es"
          ? "Las contraseñas no coinciden"
          : "Passwords do not match",
    });
  }

  if (names && names !== "") newUser.names = names;
  if (lastNames && lastNames !== "") newUser.lastNames = lastNames;
  if (phone && phone !== "") newUser.phone = phone;

  if (password !== "") {
    return bcrypt.hash(password, saltRounds, function (err, hash) {
      newUser.password = hash;

      return User.findById(req.decoded.id, "_id")
        .then((user) => {
          if (!user) {
            return res.status(404).json({
              success: false,
              message:
                locale === "es" ? "Usuario no encontrado" : "User not found",
            });
          }

          return User.findByIdAndUpdate({ _id: req.decoded.id }, newUser);
        })
        .then((user) => {
          return res.status(200).json({
            success: true,
            message:
              locale === "es"
                ? "Usuario modificado con éxito"
                : "User modified successfully",
            user: { ...user, password: null },
          });
        })
        .catch((error) => {
          return res.status(500).json({
            error,
            message:
              locale === "es"
                ? "Ocurrió un error inesperado"
                : "An unexpected error happened",
          });
        });
    });
  }

  return User.findById(req.decoded.id, "_id")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: locale === "es" ? "Usuario no encontrado" : "User not found",
        });
      }

      return User.findByIdAndUpdate({ _id: req.decoded.id }, newUser);
    })
    .then((user) => {
      return res.status(200).json({
        success: true,
        message:
          locale === "es"
            ? "Usuario modificado con éxito"
            : "User modified successfully",
        user: { ...user, password: null },
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message:
          locale === "es"
            ? "Ocurrió un error inesperado"
            : "An unexpected error happened",
      });
    });
};
