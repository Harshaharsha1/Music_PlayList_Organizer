import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  album: { type: String, default: '', trim: true },
  genre: { type: String, default: '', trim: true },
  durationSec: { type: Number, default: 0 },
}, { timestamps: true });

SongSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.model('Song', SongSchema);
