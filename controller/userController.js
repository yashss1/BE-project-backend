const userSc = require("../schema/userSchema");
require("dotenv").config();

exports.addUser = async (req, res) => {
  let userId;
  try {
    user = await userSc.create(req.body);
    user = user.toObject();
    userId = user._id;

    res.status(200).json({
      type: "success",
      message: "User Added",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: `Internal server error : ${error}`,
    });
  }
};

exports.getUser = async (req, res) => {
  let userId = req.params.userId;

  console.log(userId);

  try {
    let data = await userSc.findOne({ privateKey: userId });
    if (data == null) {
      return res.status(404).send({
        statusCode: 404,
        message: "UserId Not found",
      });
    }
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

