import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  dob?: Date;
  googleId?: string;
  profilePicture?: string;
  otpData?: {
    otp: string;
    expiry: Date;
  };
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      // Make name not required for temporary users created during OTP generation
      required: false,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    dob: {
      type: Date,
    },
    googleId: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    otpData: {
      otp: {
        type: String,
      },
      expiry: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
