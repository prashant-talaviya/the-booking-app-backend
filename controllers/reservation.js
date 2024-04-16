import Reservation from "../models/Reservation.js";


//CREATE REGISTRATION DATA
// export const createReservation = async (req, res, next) => {
//     const newReservation = new Reservation(req.body)

//     try {
//         const savedReservation = await newReservation.save()
//         res.status(200).json(savedReservation)
//     } catch (err) {
//         next(err)
//     }
// }

export const getMyBookings = async (req, res, next) => {
  try {
    const username = req.query.username; // Get the username from the query parameters
    if (!username) {
      // Handle the case where username is not provided in the query
      return res.status(400).json({ error: 'Username parameter is missing in the query.' });
    }

    // Use Mongoose to find reservations by username
    const bookings = await Reservation.find({ username });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const createReservation = async (req, res, next) => {
  try {
    // Destructure all needed fields from the request body
    const {
      name, hotelName, hotelAddress, hotelPhoto, checkInDate, checkOutDate,
      totalPrice, reservationRooms, roomType, phone, guestName, email,
      cardNumber, expiryDate, cvv, username, hotelId
    } = req.body;

    // Create a new reservation document with all fields
    const reservation = new Reservation({
      name, hotelName, hotelAddress, hotelPhoto, checkInDate, checkOutDate,
      totalPrice, reservationRooms, roomType, phone, guestName, email,
      cardNumber, expiryDate, cvv, username, hotelId
    });

    // Save the new reservation to the database
    await reservation.save();

    // Send a response back to the client
    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

//GET ALL RESERVATION DATA
export const getReservations = async (req, res, next) => {
    try {
      const reservations = await Reservation.find({});
      res.status(200).json(reservations);
    } catch (err) {
      next(err);
    }
  };

//get reservation data of id
// export const getReservation = async (req, res, next) => {
//     try {
//         const reservations = await Reservation.findById(req.params.id)
//         res.status(200).json(reservations)
//     } catch (err) {
//         next(err)
//     }
// }


export const getReservation = async (req, res, next) => {
  try {
      const name = req.query.name; // Get the name from the query parameters
      if (!name) {
          // Handle the case where name is not provided in the query
          return res.status(400).json({ error: 'Name parameter is missing in the query.' });
      }

      // Use Mongoose to find a reservation by name
      const reservations = await Reservation.findOne({ name });

      if (!reservations) {
          return res.status(404).json({ error: 'Reservation not found.' });
      }

      res.status(200).json(reservations);
  } catch (err) {
      next(err);
  }
};



export const deleteReservation = async (req, res, next) => {
  const reservationId = req.params.id;

  try {
    // Use Mongoose to find and delete the reservation by ID
    const deletedReservation = await Reservation.findByIdAndRemove(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    res.status(204).send(); // 204 status indicates no content after successful deletion
  } catch (err) {
    next(err);
  }
};