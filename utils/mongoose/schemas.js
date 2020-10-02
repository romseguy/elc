import mongoose from "mongoose";

export const ParentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  children: {
    type: [String]
  }
});

const SkillRefSchema = new mongoose.Schema({
  skill: String,
  date: Date
});

const WorkshopRefSchema = new mongoose.Schema({
  workshop: String,
  started: Date,
  completed: Date
});

export const ProfileSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date
  },
  skills: {
    type: [SkillRefSchema]
  },
  parents: {
    type: [String]
  },
  workshops: {
    type: [WorkshopRefSchema]
  }
});

ProfileSchema.index(
  {
    firstname: 1,
    lastname: 1
  },
  { unique: true, background: true }
);

export const SkillSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String
  },
  level: {
    type: String
  }
});

export const WorkshopSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Le nom de l'atelier est obligatoire"],
    minlength: [3, "Le nom de l'atelier est trop court"]
  },
  skills: {
    type: [String]
  }
  // state: {
  //   type: String,
  //   enum: ["idle", "ongoing", "done"],
  //   default: "idle",
  // },
});
