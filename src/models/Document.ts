import mongoose from 'mongoose'

export interface IDocument {
  title: string
  slug: string
  content: string
  category: string
  description?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new mongoose.Schema<IDocument>({
  title: {
    type: String,
    required: [true, 'Bitte geben Sie einen Titel an'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Ein Slug ist erforderlich'],
    unique: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Inhalt ist erforderlich'],
  },
  category: {
    type: String,
    required: [true, 'Kategorie ist erforderlich'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
})

// Erstelle einen Text-Index für die Volltextsuche
DocumentSchema.index({
  title: 'text',
  content: 'text',
  description: 'text',
  tags: 'text',
})

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema)
