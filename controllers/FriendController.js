const Friend = require("../models/Friend");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formidable = require("formidable");

exports.createFriend = (req, res, next) => {
  const user = req.decoded;

  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    if (!fields.name) {
      return res.status(400).json({ message: "Missing name field" });
    }

    if (!fields.characteristics) {
      return res.status(400).json({ message: "Missing characteristics field" });
    }

    if (!fields.description) {
      return res.status(400).json({ message: "Missing description field" });
    }

    if (!fields.breed) {
      return res.status(400).json({ message: "Missing breed field" });
    }

    if (!fields.location) {
      return res.status(400).json({ message: "Missing location field" });
    }

    if (!files.image) {
      return res.status(400).json({ message: "Missing image field" });
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
          return res
            .status(200)
            .json({ success: true, message: "Creation successful" });
        });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};

exports.getFriend = (req, res, next) => {
  Friend.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Friend not found" });
      }

      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

exports.getFriends = (req, res, next) => {
  Friend.find({ owner: { $ne: req.decoded.id } })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "No friends were found" });
      }

      return res.status(200).json({ friends: result });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

exports.getMyFriends = (req, res, next) => {
  Friend.find({ owner: req.decoded.id })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "No friends were found" });
      }

      return res.status(200).json({ friends: result });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

exports.updateFriend = (req, res, next) => {
  const user = req.decoded;

  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    return Friend.findById(req.params.id)
      .then((result) => {
        if (!result) {
          return res
            .status(404)
            .json({ success: false, message: "Friend not found" });
        }

        if (result.owner !== user.id)
          return res
            .status(401)
            .json({ success: false, message: "You are not that dog's owner" });

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
        return res
          .status(200)
          .json({ succes: true, message: "Updated friend" });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};

exports.deleteFriend = (req, res, next) => {
  const user = req.decoded;

  Friend.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "Friend not found" });
      }

      if (result.owner !== user.id)
        return res
          .status(401)
          .json({ success: false, message: "You are not that dog's owner" });

      return Friend.findByIdAndDelete({ _id: req.params.id });
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
