import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const USER_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    username: String,
    email: { 
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: String,
    type: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.statics.createUser = async function (
      username,
      email,
      password,
      type
) {
  try {
    const user = await this.create({ username, email, password, type });
    return user;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw ({ error: 'No user with this id found' });
    return user;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getUserByEmail = async function (email) {
  try {
    const user = await this.findOne({ email: email });
    if (!user) throw ({ error: 'No user with this email found' });
    return user;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
}

export default mongoose.model("User", userSchema);
