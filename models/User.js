import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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


UserSchema.methods.toAuthJSON = function toAuthJSON(){
  return {
    email: this.email,
    token: this.generateJWT()
  }
}

export default mongoose.model('User', UserSchema)
