import mongoose from 'mongoose'

export interface IProject {
  title: string
  description: string
  githubUrl: string
  demoUrl?: string
  technologies: string[]
  stars?: number
  language?: string
  topics?: string[]
  lastAnalyzed: Date
  readme?: string
  packageJson?: {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  isAwesomeList?: boolean
  categories?: {
    name: string
    items: {
      name: string
      description: string
      url: string
    }[]
  }[]
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new mongoose.Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Titel ist erforderlich'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Beschreibung ist erforderlich'],
    trim: true,
  },
  githubUrl: {
    type: String,
    required: [true, 'GitHub URL ist erforderlich'],
    unique: true,
    trim: true,
  },
  demoUrl: {
    type: String,
    trim: true,
  },
  technologies: [{
    type: String,
    trim: true,
  }],
  stars: Number,
  language: String,
  topics: [String],
  lastAnalyzed: {
    type: Date,
    default: Date.now,
  },
  readme: String,
  packageJson: {
    dependencies: {
      type: Map,
      of: String,
    },
    devDependencies: {
      type: Map,
      of: String,
    },
  },
  isAwesomeList: {
    type: Boolean,
    default: false,
  },
  categories: [{
    name: {
      type: String,
      required: true,
    },
    items: [{
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }],
  }],
}, {
  timestamps: true,
})

// Text-Index für die Suche
ProjectSchema.index({
  title: 'text',
  description: 'text',
  technologies: 'text',
  topics: 'text',
})

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
