const { verifyToken, VerandAuth, VerandAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const User = require("../models/User");


//Update
router.put("/:id", VerandAuth, async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
  
    try {
      console.log(req.body)
      const updatedUser = await User.findOne({_id : req.params.id});
      updatedUser.username = req.body.username;
      updatedUser.password = req.body.password;
      const newUser = await updatedUser.save()
      res.status(200).json(newUser);
    
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //DELETE
router.delete("/:id", VerandAuth, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //GET USER
router.get("/find/:id", VerandAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //GET ALL USER
router.get("/", VerandAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//GET USER STATS
router.get("/stats", VerandAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });



module.exports = router