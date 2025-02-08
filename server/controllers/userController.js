const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await Users.findOne({ username });
    if (usernameCheck) {
      return res.json({
        status: false,
        message: "Username Already Taken!",
      });
    }
    const emailCheck = await Users.findOne({ email });
    if (emailCheck) {
      return res.json({
        status: false,
        message: "Email Already Used!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({
      status: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    if (!user) {
      return res.json({
        status: false,
        message: "Username or Password Incorrect!",
      });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.json({
        status: false,
        message: "Username or Password Incorrect!",
      });
    }
    delete user.password;
    return res.json({
      status: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const image = req.body.image;
    const user = await Users.findByIdAndUpdate(
      userId,
      {
        isAvatarActive: true,
        avatarImage: image,
      },
      { new: true }
    );
    return res.json({
      isSet: true,
      image: user.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try{
    const userId = req.params.id;
    const contacts = await Users.find({_id: {$ne: userId}}).select([
      "email","username","avatarImage","_id"
    ]);
    return res.json(contacts);
  }
  catch(error){
    next(error);
  }
}