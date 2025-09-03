import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
