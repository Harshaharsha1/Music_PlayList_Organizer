import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
}, { timestamps: true });

PlaylistSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.model('Playlist', PlaylistSchema);
