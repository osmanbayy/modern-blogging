import express from 'express';
import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "./Schema/User.js";
import { nanoid } from 'nanoid';
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth";
import serviceAccountKey from "./serviceAccountKey.json" with { type: "json" };

const server = express();
const { MONGODB_URI, PORT, JWT_SECRET } = process.env;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

server.use(express.json());
server.use(cors());

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.log("MongoDB Connection Failed: ", err.message);
    process.exit(1);
  });

const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

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
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });
  if (isUsernameNotUnique) {
    username = `${username}-${nanoid(4)}`;
  }

  return username;
}

server.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  if (fullname.length < 3) {
    return res.status(400).json({ success: false, message: "Fullname must be at least 3 letters long!" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format!" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password should be 6 to 20 characters long with a numeric, 1 numeric and 1 uppercase letters!" });
  }

  const emailIsExists = await User.findOne({ "personal_info.email": email });
  if (emailIsExists) {
    return res.status(409).json({ success: false, message: "This email is already in use." });
  }

  try {
    const hashed_password = await bcrypt.hash(password, 10);
    const username = await generateUsername(email)
    const user = new User({
      personal_info: { fullname, email, password: hashed_password, username }
    });

    const usr = await user.save();
    return res.status(200).json(formatDataToSend(usr));
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

server.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid credentials." });
    }
    const result = await bcrypt.compare(password, user.personal_info.password);
    if (!result) {
      return res.status(403).json({ success: false, message: "Invalid credentials." });
    }
    return res.status(200).json(formatDataToSend(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
})

server.post("/google-auth", async (req, res) => {
  const { access_token } = req.body;

  try {
    // 1. Token Doğrulama
    const decodedUser = await getAuth().verifyIdToken(access_token);
    let { email, name, picture } = decodedUser;

    // Resim boyutunu güncelle (Değişkenin güncellenebilmesi için let veya yeni bir değişken gerekir)
    picture = picture.replace("s96-c", "s384-c");

    // 2. Kullanıcıyı Veritabanında Ara
    let user = await User.findOne({ "personal_info.email": email })
      .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

    if (user) {
      // Giriş Senaryosu: Daha önce şifreyle kayıt olduysa Google ile girmesine izin verme (veya bağla)
      if (!user.google_auth) {
        return res.status(403).json({
          success: false,
          message: "This email cannot use Google Authentication. Try logging in using your password."
        });
      }
    } else {
      // Kayıt Senaryosu: Yeni kullanıcı oluştur
      const username = await generateUsername(email);

      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: picture,
          username
        },
        google_auth: true
      });

      await user.save();
    }

    // 3. Başarılı Yanıt
    return res.status(200).json(formatDataToSend(user));

  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Kimlik doğrulanırken bir hata oluştu: " + err.message
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT} port`);
})