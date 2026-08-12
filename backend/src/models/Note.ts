import mongoose, { Document, Schema } from 'mongoose';

// Interface for TypeScript 
export interface INote extends Document {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId; // Links note to a specific user
  createdAt: Date;
  updatedAt: Date;
}

//  Mongoose Schema 
const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,
    },
  },
  {
    timestamps: true, // Manages createdAt and updatedAt fields  automatically
  }
);

//  Text Indexing for Search
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;