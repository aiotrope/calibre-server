import { Schema, model } from 'mongoose'

const RepositorySchema = new Schema(
  {
    ownerName: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
    },
    repositoryName: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
    },
    fullName: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    avatarUrl: { type: String, trim: true, required: true },
    language: { type: String, trim: true, required: true },
    url: { type: String, trim: true, required: true },
    forksCount: { type: Number, required: true },
    stargazersCount: { type: Number, required: true },
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
