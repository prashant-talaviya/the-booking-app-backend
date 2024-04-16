import mongoose from 'mongoose';
const { Schema } = mongoose;
const SeatSchema = new Schema({
    seatNumber: Number,
    isBooked: { type: Boolean, default: false },
    username: {
        type: String
    },
    pname: {
        type: String
    },
    age:{
        type:String
    },
    email:{
        type:String
    },
    phone: {
        type: Number
    },
    
});

const BusSchema = new Schema({
    name: { type: String, required: true },
    operator: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    date: { type: Date, required: true },
    // amenities: { type: String, required: true },
    busType: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Seating'], required: true },
    timing: {
        departure: { type: String, required: true },
        arrival: { type: String, required: true }
    },
    route: {
        from: { type: String, required: true },
        to: { type: String, required: true }
    },
    ticketPrice: { type: Number, required: true },
    seats: [SeatSchema]
});

// Initialize seats when a new bus is created
BusSchema.pre('save', function (next) {
    // Check if the document is new or if the totalSeats value has changed
    if (this.isNew || this.isModified('totalSeats')) {
        this.seats = Array.from({ length: this.totalSeats }, (_, index) => ({
            seatNumber: index + 1,
            isBooked: false  // Ensure seats are not booked by default
        }));
    }
    next();
});


export default mongoose.model('Bus', BusSchema);
