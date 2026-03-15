import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";

export const generateUsername = async (email) => {
  let username = email.split("@")[0];
  // Check username is exists
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });
  if (isUsernameNotUnique) {
    username = `${username}-${nanoid(4)}`;
  }

  return username;
}

export const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname
  }
}