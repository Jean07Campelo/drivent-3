import { notFoundError } from "@/errors";
//import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";

async function checkTicketHotelIsPaid(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (!ticket.TicketType.isRemote && ticket.TicketType.includesHotel) {
    return ticket;
  }
}

async function findHotels() {
  const hotelsList = await hotelRepository.findHotelList();
    
  if (!hotelsList) {
    throw notFoundError();
  }

  return hotelsList;
}

async function findRoomsByHotelId(hotelId: number) {
  const roomsByHotelId = await hotelRepository.findRooms(hotelId);

  if (!roomsByHotelId) {
    throw notFoundError();
  }
  
  return roomsByHotelId;
}

const hotelService = {
  checkTicketHotelIsPaid,
  findHotels,
  findRoomsByHotelId
};

export default hotelService;
