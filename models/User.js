import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'

//TODO: add uniqueness and email validations to email field

const UserSchema = new Schema({
  email:{type:String,
    required:true,
    lowercase:true,
    index:true,
    unique:true},
  passwordHash:{
    type:String,
    required:true
  },
  confirmed: {
    type: Boolean, default:false
  }
}, {timestamps:true})


UserSchema.methods.isValidPassword = function isValidPassword(password){
  return bcrypt.compareSync(password, this.passwordHash)
}

UserSchema.methods.generateJWT = function generateJWT(){
  return jwt.sign({
    email:this.email
  }, process.env.JWT_SECRET)
}

UserSchema.methods.setPassword = function setPassword(password){
  this.passwordHash = bcrypt.hashSync(password, 10)
}


UserSchema.methods.toAuthJSON = function toAuthJSON(){
  return {
    email: this.email,
    confirmed:this.confirmed,
    token: this.generateJWT()
  }
}

UserSchema.plugin(uniqueValidator, {message: 'This email is already registered'})

export default mongoose.model('User', UserSchema)
