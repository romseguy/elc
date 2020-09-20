import mongoose from "mongoose";

const SkillRefSchema = new mongoose.Schema({
  skill: String,
  date: Date,
});

export const ProfileSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
  },
  skills: {
    type: [SkillRefSchema],
  },
});

ProfileSchema.index(
  {
    firstname: 1,
    lastname: 1,
  },
  { unique: true, background: true }
);

export const SkillSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
  },
  level: {
    type: String,
  },
});
