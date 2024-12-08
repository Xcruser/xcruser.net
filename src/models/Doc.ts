import mongoose from 'mongoose'

export interface IDoc {
  title: string
  description: string
  content: string
  githubUrl: string
  category: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

const docSchema = new mongoose.Schema<IDoc>({
  title: {
    type: String,
    required: [true, 'Titel ist erforderlich'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Beschreibung ist erforderlich'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Inhalt ist erforderlich']
  },
  githubUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Kategorie ist erforderlich'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug ist erforderlich'],
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Aktualisiere updatedAt vor dem Speichern
docSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Doc || mongoose.model<IDoc>('Doc', docSchema)
