import { Schema, model } from 'mongoose'

const ReviewSchema = new Schema(
  {
    repositoryIdentification: {
      type: String,
      trim: true,
      required: true,
    },
    rating: { type: Number, required: true, min: 0, max: 100, default: 0 },
    reviewText: { type: String, trim: true, required: true },
    repository: {
      type: Schema.Types.ObjectId,
      ref: 'Repository',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

ReviewSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  },
})

const Review = model('Review', ReviewSchema)

export default Review
