import mongoose, { Model, Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
  username: string
  firstName: string
  lastName: string
  email: string
  website?: string
  socialLinks?: {
    telegram?: string
    facebook?: string
    twitter?: string
    github?: string
    linkedin?: string
    instagram?: string
  }
  password: string
  createdAt: Date
  updatedAt: Date
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel>({
  username: {
    type: String,
    required: [true, 'Benutzername ist erforderlich'],
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'Vorname ist erforderlich'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Nachname ist erforderlich'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Bitte geben Sie eine gültige E-Mail-Adresse ein'],
  },
  website: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Bitte geben Sie eine gültige URL ein',
    ],
  },
  socialLinks: {
    telegram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
  password: {
    type: String,
    required: [true, 'Passwort ist erforderlich'],
    minlength: [8, 'Passwort muss mindestens 8 Zeichen lang sein'],
    select: false // Passwort wird standardmäßig nicht bei Abfragen zurückgegeben
  },
}, {
  timestamps: true,
})

// Virtuals
UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`
})

// Indexe
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ email: 1 }, { unique: true })

// Pre-save Hook zum Hashen des Passworts
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Methode zum Vergleichen von Passwörtern
UserSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    console.log('Vergleiche Passwörter:')
    console.log('1. Gespeicherter Hash:', this.password)
    console.log('2. Salt aus Hash:', this.password.split('$')[3].substring(0, 22))
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log('3. Vergleichs-Ergebnis:', isMatch)
    return isMatch;
  } catch (error) {
    console.error('Fehler beim Passwort-Vergleich:', error)
    return false;
  }
};

export default mongoose.models.User || mongoose.model<IUser, UserModel>('User', UserSchema)
