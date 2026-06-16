import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    // Demo self-cleanup: visitor accounts get an expiry set at registration and are
    // auto-deleted by MongoDB's TTL monitor. The seeded demo account leaves this unset
    // (undefined), so it never expires.
    expiresAt:    { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.expiresAt;
      },
    },
  }
);

// TTL index — MongoDB deletes the document once `expiresAt` is reached.
// Docs without an expiresAt (e.g. the demo account) are ignored by the TTL monitor.
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model('User', userSchema);
