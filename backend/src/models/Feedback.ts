import mongoose, {
  Schema,
  type InferSchemaType,
} from 'mongoose'

const feedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    contentType: {
      type: String,
      enum: [
        'meme',
        'ai-insight',
        'market-news',
        'coin-prices',
      ],
      required: true,
    },

    contentId: {
      type: String,
      required: true,
      trim: true,
    },

    vote: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

feedbackSchema.index(
  {
    userId: 1,
    contentType: 1,
    contentId: 1,
  },
  {
    unique: true,
  },
)

export type FeedbackDocument =
  InferSchemaType<typeof feedbackSchema>

const Feedback = mongoose.model(
  'Feedback',
  feedbackSchema,
)

export default Feedback