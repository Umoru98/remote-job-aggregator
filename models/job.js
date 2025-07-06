import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  url: { type: String, unique: true },
  source: String,
  datePosted: Date,
  notified: { type: Boolean, default: false },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;