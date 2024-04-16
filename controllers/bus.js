import Bus from '../models/Bus.js';

export const createBus = async (req, res, next) => {
  const newBus = new Bus(req.body);
  try {
    const savedBus = await newBus.save();
    res.status(200).json(savedBus);
  } catch (err) {
    next(err);
  }
};

export const bookSeat = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    const seat = bus.seats.find(s => s.seatNumber === req.body.seatNumber);

    if (!seat) {
      return res.status(404).json({ message: "Seat not found." });
    }

    if (seat.isBooked) {
      return res.status(400).json({ message: "This seat is already booked." });
    }

    // Set seat as booked and update with passenger details
    seat.isBooked = true;
    seat.username = req.body.username;
    seat.pname = req.body.pname; // Assuming these fields are provided in the request body
    seat.age = req.body.age; // Assuming these fields are provided in the request body
    seat.email = req.body.email;
    seat.phone = req.body.phone;

    bus.markModified('seats');
    await bus.save();

    res.status(200).json({ message: "Seat booked successfully." });
  } catch (err) {
    next(err);
  }
};



export const getBookedTicketsWithDetails = async (req, res, next) => {
  try {
    // Fetch all buses
    const buses = await Bus.find();

    // Filter out buses with at least one booked seat and map to desired structure
    const bookedDetails = buses.filter(bus => bus.seats.some(seat => seat.isBooked))
      .map(bus => {
        // Extract details of booked seats
        const bookedSeats = bus.seats
          .filter(seat => seat.isBooked)
          .map(seat => ({
            seatNumber: seat.seatNumber,
            username: seat.username,
            pname: seat.pname, // Passenger's name
            age: seat.age,
            email: seat.email,
            phone: seat.phone
          }));

        // Return combined bus and booked seat details
        return {
          busId: bus._id,
          name: bus.name,
          time:bus.timing,
          price:bus.ticketPrice,
          operator: bus.operator,
          date: bus.date,
          route: bus.route,
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
    // Fetch all buses
    const buses = await Bus.find();

    // Filter out buses with at least one booked seat and map to desired structure
    const bookedDetails = buses.filter(bus => bus.seats.some(seat => seat.isBooked && (!username || seat.username === username)))
      .map(bus => {
        // Extract details of booked seats, further filtering by username if provided
        const bookedSeats = bus.seats
          .filter(seat => seat.isBooked && (!username || seat.username === username))
          .map(seat => ({
            seatNumber: seat.seatNumber,
            username: seat.username,
            pname: seat.pname, // Passenger's name
            age: seat.age,
            email: seat.email,
            phone: seat.phone
          }));

        // Return combined bus and booked seat details
        return {
          busId: bus._id,
          name: bus.name,
          operator: bus.operator,
          date: bus.date,
          route: bus.route,
          time: bus.timing,
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





export const searchBuses = async (req, res, next) => {
  const { from, to, date } = req.query;

  try {
    // Convert date string to start and end of the day for accurate matching
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const buses = await Bus.find({
      "route.from": from,
      "route.to": to,
      date: {
        $gte: dayStart,
        $lte: dayEnd
      }
    });

    res.status(200).json(buses);
  } catch (err) {
    next(err);
  }
};



// export const getAllBuses = async (req, res, next) => {
//   try {
//     const buses = await Bus.find();
//     res.status(200).json(buses);
//   } catch (err) {
//     next(err);
//   }
// };

export const getAllBuses = async (req, res, next) => {
  const { min, max, ...others } = req.query;

  try {
    // Check if min and max are valid numbers
    const minPrice = !isNaN(parseFloat(min)) ? parseFloat(min) : 1;
    const maxPrice = !isNaN(parseFloat(max)) ? parseFloat(max) : 50000;

    const buses = await Bus.find({
      ...others,
      ticketPrice: { $gt: minPrice, $lte: maxPrice }
    });

    res.status(200).json(buses);
  } catch (err) {
    // Pass the error to the error handling middleware
    next(err);
  }
};





export const deleteBus = async (req, res, next) => {
  try {
    // Find the bus by ID and delete it
    const deletedBus = await Bus.findByIdAndDelete(req.params.busId);

    // If bus is not found
    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    res.status(200).json({ message: "Bus deleted successfully." });
  } catch (err) {
    next(err);
  }
};




// Update a bus
export const updateBus = async (req, res, next) => {
  const { busId } = req.params; // Extract the bus ID from request parameters
  const updateData = req.body; // The updated data

  try {
    // Find the bus by ID and update it with the provided data
    // { new: true } option returns the document after update was applied
    const updatedBus = await Bus.findByIdAndUpdate(busId, updateData, { new: true });

    // If bus is not found
    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    res.status(200).json(updatedBus);
  } catch (err) {
    next(err); // Pass errors to the error handler
  }
};


export const cancelTicket = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    const seat = bus.seats.find(s => s.seatNumber === req.body.seatNumber);

    if (!seat) {
      return res.status(404).json({ message: "Seat not found." });
    }

    if (!seat.isBooked) {
      return res.status(400).json({ message: "This seat is not currently booked." });
    }

    // Reset seat booking status and clear passenger details
    seat.isBooked = false;
    seat.username = undefined;
    seat.pname = undefined;
    seat.age = undefined;
    seat.email = undefined;
    seat.phone = undefined;

    bus.markModified('seats');
    await bus.save();

    res.status(200).json({ message: "Ticket cancellation successful." });
  } catch (err) {
    next(err);
  }
};


