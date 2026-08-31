import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    round: { type: String, required: true },
    category: { type: String, default: 'General' },
    question: { type: String, required: true },
    options: { type: Array, default: [] },
    answer: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
