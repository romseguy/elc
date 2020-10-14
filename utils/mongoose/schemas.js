import mongoose from "mongoose";

export const DomainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Veuillez saisir un libellé"
  }
});

export const ParentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: "Veuillez saisir un prénom"
  },
  lastname: {
    type: String,
    required: "Veuillez saisir un nom"
  },
  email: {
    type: String,
    required: "Veuillez saisir un email",
    unique: true
  },
  children: {
    type: [String],
    default: []
  }
});

const SkillRefSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  workshop: String,
  date: Date
});

const WorkshopRefSchema = new mongoose.Schema({
  workshop: {
    type: String,
    required: true
  },
  started: {
    type: Date,
    default: null
  },
  completed: {
    type: Date,
    default: null
  }
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
    type: Date,
    default: null
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
    type: String,
    default: null
  },
  level: {
    type: String,
    default: null
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
    type: [String],
    default: []
  }
  // state: {
  //   type: String,
  //   enum: ["idle", "ongoing", "done"],
  //   default: "idle",
  // },
});
