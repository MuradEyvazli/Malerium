// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      // Only require password for local authentication
      required: function() {
        return !this.googleId;
      },
    },
    // OAuth fields
    googleId: {
      type: String,
      default: null,
    },
    // Existing profile fields
    avatar: {
      type: String,
      default:
        'https://images.pexels.com/photos/30469688/pexels-photo-30469688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    bio: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    // Other fields
    nickName: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Password hashing - only runs if password exists and was modified
UserSchema.pre('save', async function (next) {
  // Skip hashing if no password or password wasn't modified
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Remove password from JSON responses
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);