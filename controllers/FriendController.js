const Friend = require("../models/Friend");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createFriend = (req, res, next) => {
  const user = req.decoded;

  if (!req.body.name) {
    return res.status(400).json({ message: "Missing name field" });
  }

  if (!req.body.characteristics) {
    return res.status(400).json({ message: "Missing characteristics field" });
  }

  if (!req.body.description) {
    return res.status(400).json({ message: "Missing description field" });
  }

  if (!req.body.breed) {
    return res.status(400).json({ message: "Missing breed field" });
  }

  if (!req.body.location) {
    return res.status(400).json({ message: "Missing location field" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Missing image field" });
  }

  return cloudinary.uploader
    .upload(req.file.path)
    .then(({ url, secure_url }) => {
      const friend = new Friend({
        ...req.body,
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

exports.updateFriend = (req, res, next) => {
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

      if (!req.file)
        return Friend.findByIdAndUpdate(
          { _id: req.params.id },
          { ...req.body }
        );

      return cloudinary.uploader.upload(req.file.path);
    })
    .then(({ url, secure_url }) => {
      if (url)
        return Friend.findByIdAndUpdate(
          { _id: req.params.id },
          { ...req.body, image: url }
        );

      return;
    })
    .then(() => {
      return res.status(200).json({ succes: true, message: "Updated friend" });
    })
    .catch((err) => {
      return res.status(500).json(err);
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
