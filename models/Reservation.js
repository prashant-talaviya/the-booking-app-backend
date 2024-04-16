import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReservationSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    hotelName:{
        type:String,
        require:true
    },
    hotelAddress:{
        type:String,
        require:true
    },
    
    hotelPhoto:{
        type:String,
        require:true
    },
    checkInDate:{
        type:Date,
        require:true
    },
    checkOutDate:{
        type:Date,
        require:true
    },
    totalPrice:{
        type:Number,
        require:true
    },
    reservationRooms:{
        type:Number,
        require:true
    },
    roomType:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    guestName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    cardNumber:{
        type:String,
        require:true
    },
    expiryDate:{
        type:String,
        require:true
    },
    cvv:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    hotelId:{
        type:String,
        require:true
    },
   
})

export default mongoose.model("Reservation",ReservationSchema)