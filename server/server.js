import express from 'express';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "./Schema/User.js";
import { nanoid } from 'nanoid';
import jwt from "jsonwebtoken";

const server = express();
const { MONGODB_URI, PORT, JWT_SECRET } = process.env;

server.use(express.json());

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(MONGODB_URI, {
  autoIndex: true,
});

const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, JWT_SECRET)

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname
  }
}

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  // Check username is exists
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)

  isUsernameNotUnique ? username += nanoid(4) : ""

  return username;
}

server.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname.length < 3) {
    return res.status(403).json({ success: false, message: "Fullname must be at least 3 letters long!" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ success: false, message: "Invalid email format!" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({ success: false, message: "Password should be 6 to 20 characters long with a numeric, 1 numeric and 1 uppercase letters!" });
  }

  const emailIsExists = await User.findOne({ "personal_info.email": email });
  if (emailIsExists) {
    return res.status(403).json({ success: false, message: "This email is already in use." });
  }

  bcrypt.hash(password, 10, async (error, hashed_password) => {
    const username = await generateUsername(email);

    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username
      }
    });

    user.save().then((usr) => {
      return res.status(200).json(formatDataToSend(usr))
    }).catch(err => {
      return res.status(500).json({ success: false, message: err.message })
    })
  });
});

server.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, message: "Email not found" });
      }
      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(403).json({ success: false, message: "An error occured while login. Please try again." })
        }
        if (!result) {
          return res.status(403).json({ success: false, message: "Invalid credentials." });
        } else {
          return res.status(200).json(formatDataToSend(user))
        }
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message })
    })
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT} port`);
})