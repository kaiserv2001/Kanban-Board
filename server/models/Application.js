import mongoose from 'mongoose';

const STATUSES = ['wishlist','applied','phone_screen','technical','final_round','offer','rejected','withdrawn'];

const applicationSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company:     { type: String, required: true, trim: true },
    role:        { type: String, required: true, trim: true },
    status:      { type: String, enum: STATUSES, default: 'wishlist' },
    appliedDate: { type: Date },
    deadline:    { type: Date },
    jobUrl:      { type: String, trim: true },
    description: { type: String },
    notes: [
      {
        body:      { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    contacts: [
      {
        name:     String,
        email:    String,
        role:     String,
        linkedIn: String,
      },
    ],
    timeline: [
      {
        event: { type: String, required: true },
        date:  { type: Date, default: Date.now },
      },
    ],
    // Mirrors the owning user's expiry so a visitor's applications are cleaned up
    // along with their account. Demo-account applications leave this unset.
    expiresAt:   { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.expiresAt;
      },
    },
  }
);

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, company: 'text', role: 'text' });
// TTL index — auto-deletes a visitor's applications once expiresAt is reached.
applicationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export { STATUSES };
export default mongoose.model('Application', applicationSchema);
