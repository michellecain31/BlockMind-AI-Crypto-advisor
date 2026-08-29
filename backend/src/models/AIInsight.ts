import mongoose, {
    Schema,
    type Document,
    type Types,
  } from 'mongoose'
  
  export interface IAIInsight extends Document {
    userId: Types.ObjectId
    dateKey: string
    title: string
    body: string
    assets: string[]
    source: 'ai' | 'fallback'
    createdAt: Date
    updatedAt: Date
  }
  
  const aiInsightSchema = new Schema<IAIInsight>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
  
      dateKey: {
        type: String,
        required: true,
      },
  
      title: {
        type: String,
        required: true,
        trim: true,
      },
  
      body: {
        type: String,
        required: true,
        trim: true,
      },
  
      assets: {
        type: [String],
        default: [],
      },
  
      source: {
        type: String,
        enum: ['ai', 'fallback'],
        required: true,
      },
    },
    {
      timestamps: true,
    },
  )
  
  aiInsightSchema.index(
    {
      userId: 1,
      dateKey: 1,
    },
    {
      unique: true,
    },
  )
  
  const AIInsight =
    mongoose.model<IAIInsight>(
      'AIInsight',
      aiInsightSchema,
    )
  
  export default AIInsight