// /models/User.js
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
      required: [true, 'Password is required'],
    },
    // Ek profil alanları
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

    // Yeni eklenen alanlar
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
    // İsterseniz timeZone vb. başka alanlar da ekleyebilirsiniz.
  },
  { timestamps: true }
);

// Şifre hashlemesi, parola kaydedilmeden veya güncellenmeden önce otomatik yapılır.
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Parolayı JSON'a dönüştürürken sil
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
