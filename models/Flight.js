import mongoose from 'mongoose';
const { Schema } = mongoose;

const SeatSchema = new Schema({
    seatNumber: String, // Flight seats often include row numbers and letters (e.g., 12A)
    isBooked: { type: Boolean, default: false },
    username: {
        type: String
    },
    pname: String,
    age: String,
    email: String,
    phone: Number,
});

const FlightSchema = new Schema({
    flightNumber: { type: String, required: true },
    airline: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    date: { type: Date, required: true },
    amenities: [String],
    classType: { type: String, enum: ['Economy', 'Business', 'First Class'], required: true },
    timing: {
        departure: { type: String, required: true },
        arrival: { type: String, required: true }
    },
    route: {
        fromAirport: { type: String, required: true },
        toAirport: { type: String, required: true }
    },
    ticketPrice: { type: Number, required: true },
    seats: [SeatSchema]
});

// Initialize seats when a new flight is created
FlightSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('totalSeats')) {
        // Consider a typical seat layout for flights or use a more complex logic for seat numbering
        this.seats = Array.from({ length: this.totalSeats }, (_, index) => {
            const seatLetter = String.fromCharCode(65 + (index % 6)); // Assuming 6 seats per row
            const seatRow = Math.floor(index / 6) + 1;
            return {
                seatNumber: `${seatRow}${seatLetter}`,
                isBooked: false
            };
        });
    }
    next();
});

export default mongoose.model('Flight', FlightSchema);
