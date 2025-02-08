const Message = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, msg } = req.body;
    const data = await Message.create({
      message: { text: msg },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({
        success: true,
        message: "Message successfully Added!",
      });
    } else {
      return res.json({
        success: false,
        message: "Message not Added!",
      });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });
    const projectMessage = messages.map((msg)=>{
        return{
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text
        }
    })
    return res.json(projectMessage)
   
  } catch (ex) {
    next(ex);
  }
};
