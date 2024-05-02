// User
// const Reservation = require('../model/reservation'); // Adjust the path based on your project structure

// async function generateRecommendations(userEmail) {
//     try {
//         // Find reservations for the specified email
//         const userReservations = await Reservation.find({ customerEmail: userEmail });

//         // Find all reservations
//         const allReservations = await Reservation.find({});

//         // Initialize an object to store user event matrix
//         const userEventMatrix = {};

//         // Iterate over all reservations to populate the user event matrix
//         allReservations.forEach(reservation => {
//             reservation.events.forEach(event => {
//                 if (!userEventMatrix[event.eventId]) {
//                     userEventMatrix[event.eventId] = {
//                         eventId: event.eventId,
//                         eventName: event.name,
//                         location: event.location,
//                         description: event.description
//                     };
//                 }
//             });
//         });

//         // Filter out events that the user has already reserved
//         const userReservedEvents = new Set(userReservations.flatMap(reservation => reservation.events.map(event => event.eventId)));
//         const recommendations = Object.values(userEventMatrix).filter(event => !userReservedEvents.has(event.eventId));

//         return recommendations;
//     } catch (error) {
//         console.error('Error generating recommendations:', error);
//         throw error;
//     }
// }

// module.exports = { generateRecommendations };

const Reservation = require('../model/reservation'); // Adjust the path based on your project structure

async function generateRecommendations(userEmail) {
    try {
        // Find reservations for the specified email
        const userReservations = await Reservation.find({ customerEmail: userEmail });
        console.log("User reservations:", userReservations); // Log user reservations

        // Find all reservations
        const allReservations = await Reservation.find({});
        console.log("All reservations:", allReservations); // Log all reservations

        // Initialize an object to store user event matrix
        const userEventMatrix = {};

        // Iterate over all reservations to populate the user event matrix
        allReservations.forEach(reservation => {
            reservation.events.forEach(event => {
                if (!userEventMatrix[event.eventId]) {
                    userEventMatrix[event.eventId] = {
                        eventId: event.eventId,
                        eventName: event.name,
                        location: event.location,
                        description: event.description
                    };
                }
            });
        });

        // Filter out events that the user has already reserved
        const userReservedEvents = new Set(userReservations.flatMap(reservation => reservation.events.map(event => event.eventId)));
        const recommendations = Object.values(userEventMatrix).filter(event => !userReservedEvents.has(event.eventId));

        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw error;
    }
}

module.exports = { generateRecommendations };
