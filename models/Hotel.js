import mongoose from 'mongoose';
const { Schema } = mongoose;

const HotelSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    distance:{
        type:String,
        require:true
    },
    photos:{
        type:[String],
    },
    desc:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    rating:{
        type:Number,
        minrating:0,
        maxrating:5
    },
    maxguest:{
        type:Number,
        min:1,
    },

    rooms:{
        type:[String],
    },
    cheapestPrice:{
        type:Number,
        require:true
    },
    featured:{
        type:Boolean,
        default:false
    },
})

export default mongoose.model("Hotel",HotelSchema)