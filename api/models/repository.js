import { Schema, model } from 'mongoose'

const RepositorySchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
    },
    description: { type: String, trim: true },
    language: { type: String, trim: true },
    forksCount: { type: Number },
    stargazersCount: { type: Number },
    ownerAvatarUrl: { type: String, trim: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { timestamps: true }
)

RepositorySchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  },
})

const Repository = model('Repository', RepositorySchema)

export default Repository
