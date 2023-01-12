import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      minLength: 5,
      validate: {
        validator: (val) => {
          return /^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-{}€"'ÄöäÖØÆ`~_]{5,}$/gm.test(
            val
          )
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },
    passwordHash: { type: String },
    repositories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Repository',
      },
    ],
    reviewsCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { timestamps: true }
)

UserSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
    delete retObject.passwordHash
  },
})

const User = model('User', UserSchema)

export default User
