import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'İsim alanı zorunludur'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-posta adresi zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Lütfen geçerli bir e-posta adresi giriniz'],
    },
    passwordHash: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Kullanıcı rolü geçersiz',
      },
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development HMR
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
