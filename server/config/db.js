import mongoose from "mongoose";

const connectDb = async (url)=>{
    mongoose.set('strictQuery',true)
    await mongoose.connect(url)
    console.log(`Connected to DB successfully`)
}
export default connectDb