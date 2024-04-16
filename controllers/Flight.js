import Flight from '../models/Flight.js'; // Adjust the path as necessary

export const createFlight = async (req, res, next) => {
    const newFlight = new Flight(req.body);
    try {
      const savedFlight = await newFlight.save();
      res.status(200).json(savedFlight);
    } catch (err) {
      next(err);
    }
  };

  // Import necessary modules and Flight model
  export const getBookedTicketsWithDetails = async (req, res, next) => {
    try {
      // Fetch all flights
      const flights = await Flight.find();
  
      // Filter out flights with at least one booked seat and map to desired structure
      const bookedDetails = flights.filter(flight => flight.seats.some(seat => seat.isBooked))
        .map(flight => {
          // Extract details of booked seats
          const bookedSeats = flight.seats
            .filter(seat => seat.isBooked)
            .map(seat => ({
              seatNumber: seat.seatNumber,
              username: seat.username,
              pname: seat.pname, // Passenger's name
              age: seat.age,
              email: seat.email,
              phone: seat.phone
            }));
  
          // Return combined flight and booked seat details
          return {
            flightId: flight._id,
            timing:flight.timing,
            price: flight.ticketPrice,
            name: flight.flightNumber,
            operator: flight.operator,
            date: flight.date,
            route: flight.route,
            bookedSeats: bookedSeats
          };
        });
  
      res.status(200).json(bookedDetails);
    } catch (err) {
      next(err);
    }
  };
  
  
  export const getTicketsByUsername = async (req, res, next) => {
    const { username } = req.query; // Get the username from query parameters
  
    try {
      // Fetch all flights
      const flights = await Flight.find();
  
      // Filter out flights with at least one booked seat and map to desired structure
      const bookedDetails = flights.filter(flight => flight.seats.some(seat => seat.isBooked && (!username || seat.username === username)))
        .map(flight => {
          // Extract details of booked seats, further filtering by username if provided
          const bookedSeats = flight.seats
            .filter(seat => seat.isBooked && (!username || seat.username === username))
            .map(seat => ({
              seatNumber: seat.seatNumber,
              username: seat.username,
              pname: seat.pname, // Passenger's name
              age: seat.age,
              email: seat.email,
              phone: seat.phone
            }));
  
          // Return combined flight and booked seat details
          return {
            flightId: flight._id,
            timing:flight.timing,
            price: flight.ticketPrice,
            name: flight.flightNumber,
            operator: flight.operator,
            date: flight.date,
            route: flight.route,
            bookedSeats: bookedSeats
          };
        });
  
      if (bookedDetails.length === 0) {
        return res.status(404).json({ message: "No tickets found for the specified username." });
      }
  
      res.status(200).json(bookedDetails);
    } catch (err) {
      next(err);
    }
  };
  

  export const bookSeat = async (req, res, next) => {
    try {
        const flight = await Flight.findById(req.params.flightId);
        const seat = flight.seats.find(s => s.seatNumber === req.body.seatNumber);
  
        if (!seat) {
            return res.status(404).json({ message: "Seat not found." });
        }
  
        if (seat.isBooked) {
            return res.status(400).json({ message: "This seat is already booked." });
        }
  
        // Set seat as booked and update with passenger details
        seat.isBooked = true;
        seat.username = req.body.username;
        seat.pname = req.body.pname;
        seat.age = req.body.age;
        seat.email = req.body.email;
        seat.phone = req.body.phone;
  
        flight.markModified('seats');
        await flight.save();
  
        res.status(200).json({ message: "Seat booked successfully." });
    } catch (err) {
        next(err);
    }
  };

  


  export const searchFlights = async (req, res, next) => {
    const { fromAirport, toAirport, date } = req.query;
  
    try {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
  
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
  
      const flights = await Flight.find({
        "route.fromAirport": fromAirport,
        "route.toAirport": toAirport,
        date: {
          $gte: dayStart,
          $lte: dayEnd
        }
      });
  
      res.status(200).json(flights);
    } catch (err) {
      next(err);
    }
  };
  
  

  export const getAllFlights = async (req, res, next) => {
    try {
      const flights = await Flight.find();
      res.status(200).json(flights);
    } catch (err) {
      next(err);
    }
  };


  // Handler function to delete a flight
export const deleteFlight = async (req, res, next) => {
  try {
    // Find the flight by ID and delete it
    const deletedFlight = await Flight.findByIdAndDelete(req.params.flightId);
    
    // If flight is not found
    if (!deletedFlight) {
      return res.status(404).json({ message: "Flight not found." });
    }
    
    res.status(200).json({ message: "Flight deleted successfully." });
  } catch (err) {
    next(err);
  }
};


export const updateFlight = async (req, res, next) => {
  try {
    // Find the flight by ID and update it with the request body. { new: true } returns the updated object
    const updatedFlight = await Flight.findByIdAndUpdate(req.params.flightId, req.body, { new: true });

    // If the flight is not found
    if (!updatedFlight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    res.status(200).json(updatedFlight);
  } catch (err) {
    next(err);
  }
};
