const Friend = require("../models/Friend");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formidable = require("formidable");

exports.createFriend = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  const user = req.decoded;

  const form = formidable({ multiples: true });

  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!fields.name) {
      return res.status(400).json({
        message:
          locale === "es" ? "Falta campo de nombre" : "Missing name field",
      });
    }

    fields.characteristics = JSON.parse(fields.characteristics);

    if (!fields.characteristics) {
      return res.status(400).json({
        message:
          locale === "es"
            ? "Falta campo de características"
            : "Missing characteristics field",
      });
    }

    if (!fields.description) {
      return res.status(400).json({
        message:
          locale === "es"
            ? "Falta campo de descripción"
            : "Missing description field",
      });
    }

    if (!fields.breed) {
      return res.status(400).json({
        message:
          locale === "es" ? "Falta campo de raza" : "Missing breed field",
      });
    }

    if (!fields.location) {
      return res.status(400).json({
        message:
          locale === "es"
            ? "Falta campo de ubicación"
            : "Missing location field",
      });
    }

    if (!files.image) {
      return res.status(400).json({
        message:
          locale === "es" ? "Falta campo de imagen" : "Missing image field",
      });
    }

    return cloudinary.uploader
      .upload(files.image.path)
      .then(({ url, secure_url }) => {
        const friend = new Friend({
          ...fields,
          likes: 0,
          dislikes: 0,
          owner: user.id,
          image: url,
        });
        friend.save().then(() => {
          return res.status(200).json({
            success: true,
            message:
              locale === "es"
                ? "Creación de friend exitosa"
                : "Friend creation successfull",
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
  });
};

exports.getFriend = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  Friend.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: locale === "es" ? "Amigo no encontrado" : "Friend not found",
        });
      }

      return res.status(200).json(result);
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

exports.getFriends = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  Friend.find({ owner: { $ne: req.decoded.id } })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message:
            locale === "es"
              ? "No se encontraron amigos"
              : "No friends were found",
        });
      }

      return res.status(200).json({
        friends: result,
        message:
          locale === "es"
            ? "Amigos recuperados con éxito"
            : "Friends retreived successfully",
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

exports.getMyFriends = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  Friend.find({ owner: req.decoded.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message:
            locale === "es"
              ? "No se encontraron amigos"
              : "No friends were found",
        });
      }

      return res.status(200).json({
        friends: result,
        message:
          locale === "es"
            ? "Amigos recuperados con éxito"
            : "Friends retreived successfully",
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

exports.updateFriend = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  const user = req.decoded;

  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    if (fields.name === "") {
      return res.status(400).json({
        message:
          locale === "es" ? "Falta campo de nombre" : "Missing name field",
      });
    }

    fields.characteristics = JSON.parse(fields.characteristics);

    if (fields.characteristics.length === 0) {
      return res.status(400).json({
        message:
          locale === "es"
            ? "Falta campo de características"
            : "Missing characteristics field",
      });
    }

    if (fields.description === "") {
      return res.status(400).json({
        message:
          locale === "es"
            ? "Falta campo de descripción"
            : "Missing description field",
      });
    }

    if (fields.breed === "") {
      return res.status(400).json({
        message:
          locale === "es" ? "Falta campo de raza" : "Missing breed field",
      });
    }

    if (fields.location === "") {
      return res.status(400).json({
        message:
          locale === "es"
            ? "Falta campo de ubicación"
            : "Missing location field",
      });
    }

    return Friend.findById(req.params.id)
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            success: false,
            message:
              locale === "es"
                ? "No se encontró a ese amigo"
                : "Friend was not found",
          });
        }

        if (result.owner !== user.id)
          return res.status(401).json({
            success: false,
            message:
              locale === "es"
                ? "No eres el dueño de ese amigo"
                : "You are not that dog's owner",
          });

        if (!files.image)
          return Friend.findByIdAndUpdate(
            { _id: req.params.id },
            { ...fields }
          );

        return cloudinary.uploader.upload(files.image.path);
      })
      .then(({ url, secure_url }) => {
        if (url)
          return Friend.findByIdAndUpdate(
            { _id: req.params.id },
            { ...fields, image: url }
          );

        return;
      })
      .then(() => {
        return res.status(200).json({
          success: true,
          message:
            locale === "es"
              ? "Se actualizó al amigo con éxito"
              : "Updated friend",
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

exports.deleteFriend = (req, res, next) => {
  const locale = req.headers["accept-language"] || "es";

  const user = req.decoded;

  Friend.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: locale === "es" ? "Amigo no encontrado" : "Friend not found",
        });
      }

      if (result.owner !== user.id)
        return res.status(401).json({
          success: false,
          message:
            locale === "es"
              ? "No eres el dueño de ese amigo"
              : "You are not that dog's owner",
        });

      return Friend.findByIdAndDelete({ _id: req.params.id });
    })
    .then((result) => {
      return res.status(200).json(result);
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
