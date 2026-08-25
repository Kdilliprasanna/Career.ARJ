import mongoose from 'mongoose';

const resumeTemplateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    atsScore: { type: Number, default: 95 },
    accent: { type: String, default: '#2563eb' },
    desc: { type: String, default: '' },
    sections: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeTemplate || mongoose.model('ResumeTemplate', resumeTemplateSchema);
