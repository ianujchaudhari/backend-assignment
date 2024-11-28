// user schema to manage user and their role also refresh token is saved in db for logout and refresh-token route
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "User" },
  refreshToken: { type: String, default: "" },
});

export default mongoose.model<IUser>("User", UserSchema);
