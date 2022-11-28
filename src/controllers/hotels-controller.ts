import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import hotelService from "@/services/hotels-service";
import { TicketStatus } from "@prisma/client";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticketWithHotel = await hotelService.checkTicketHotelIsPaid(userId);

    if (ticketWithHotel.status !== TicketStatus.PAID) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    try {
      const hotelList = await hotelService.findHotels();
      return res.status(httpStatus.OK).send(hotelList);
    } catch (error) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  } catch (error) {
    if (error.name === "PaymentRequired") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
  const { userId } = req;

  try {
    const ticketWithHotel = await hotelService.checkTicketHotelIsPaid(userId);
    if (ticketWithHotel.status !== TicketStatus.PAID) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    const rooms = await hotelService.findRoomsByHotelId(hotelId);
    if (rooms.length === 0) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
