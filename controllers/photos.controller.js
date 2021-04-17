const Photo = require("../models/photo.model");
const Voter = require("../models/Voter.model");
const requestIp = require("request-ip");

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if (title && author && email && file) {
      // if fields are not empty...

      const fileName = file.path.split("/").slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split(".").slice(-1)[0];
      const strippedTitle = title.replace(/(<([^>]+)>)/gi, "");
      const strippedAuthor = author.replace(/(<([^>]+)>)/gi, "");
      const isEmailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );

      if (!isEmailValid) throw new Error("Wrong input!");

      if (fileExt !== "gif" && fileExt !== "jpg" && fileExt !== "png") {
        throw new Error("Wrong input!");
      }

      if (strippedTitle.length > 25 || strippedAuthor.length > 50)
        throw new Error("Wrong input!");

      const newPhoto = new Photo({
        title: strippedTitle,
        author: strippedAuthor,
        email,
        src: fileName,
        votes: 0,
      });
      await newPhoto.save(); // ...save new photo in DB
      res.json(newPhoto);
    } else {
      throw new Error("Wrong input!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {
  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }
};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    const userToVote = await Voter.findOne({ user: clientIp });

    if (!photoToUpdate) {
      res.status(404).json({ message: "Not found" });
    } else if (!userToVote) {
      const newVoter = new Voter({
        user: clientIp,
        votes: [req.params.id],
      });
      await newVoter.save();
      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: "OK" });
    } else if (!userToVote.votes.includes(req.params.id)) {
      userToVote.votes.push(req.params.id);
      await userToVote.save();
      photoToUpdate.votes++;
      await photoToUpdate.save();
      res.send({ message: "OK" });
    } else {
      res.status(404).json({ message: "Error" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
