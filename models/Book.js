import mongoose, {Schema} from 'mongoose'


const BookSchema = new Schema({
  title: {type:String, required:true},
  authors: {type:String, required:true},
  cover: {type:String, required:true},
  goodreadsId: {type:String, required:true},
  pages: {type:String, required:true},
  userId: {type:mongoose.Schema.Types.ObjectId, required:true},

})




export default mongoose.model('Book', BookSchema)
