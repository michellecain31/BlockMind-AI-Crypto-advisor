import mongoose, { Schema, type Document } from 'mongoose'

export type InvestorStyle =
  | 'hodler'
  | 'day-trader'
  | 'nft-collector'

export type ContentPreference =
  | 'market-news'
  | 'charts'
  | 'social'
  | 'fun'

export interface IUser extends Document {
  name: string
  email: string
  password: string

  onboardingCompleted: boolean

  preferences: {
    assets: string[]
    investorStyle?: InvestorStyle
    contentPreferences: ContentPreference[]
  }

  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    preferences: {
      assets: {
        type: [String],
        default: [],
      },

      investorStyle: {
        type: String,
        enum: ['hodler', 'day-trader', 'nft-collector'],
      },

      contentPreferences: {
        type: [String],
        enum: ['market-news', 'charts', 'social', 'fun'],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model<IUser>('User', userSchema)

export default User