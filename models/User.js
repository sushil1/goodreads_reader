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
  },
  confirmationToken: {
    type:String,
    default:''
  }
}, {timestamps:true})


UserSchema.methods.isValidPassword = function isValidPassword(password){
  return bcrypt.compareSync(password, this.passwordHash)
}

UserSchema.methods.generateJWT = function generateJWT(){
  return jwt.sign({
    email:this.email,
    confirmed: this.confirmed
  }, process.env.JWT_SECRET)
}

UserSchema.methods.setPassword = function setPassword(password){
  this.passwordHash = bcrypt.hashSync(password, 10)
}

UserSchema.methods.setConfirmationToken = function setConfirmationToken(){
  this.confirmationToken = this.generateJWT()
}

UserSchema.methods.toAuthJSON = function toAuthJSON(){
  return {
    email: this.email,
    confirmed:this.confirmed,
    token: this.generateJWT()
  }
}

UserSchema.methods.generateConfirmationUrl = function generateConfirmationUrl(){
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`
}

UserSchema.methods.generateResetPasswordLink = function generateResetPasswordLink(){
  return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken()}`
}

UserSchema.methods.generateResetPasswordToken = function generateResetPasswordToken(){
  return jwt.sign({
    _id: this._id
  }, process.env.JWT_SECRET, {expiresIn: "1h"}
)
}


UserSchema.plugin(uniqueValidator, {message: 'This {PATH} is already registered'})

export default mongoose.model('User', UserSchema)
