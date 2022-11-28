import { prisma } from "@/config";

async function findHotelList() {
  return prisma.hotel.findMany();
}

async function findRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId
    }
  });
}

const hotelRepository = {
  findHotelList,
  findRooms
};

export default hotelRepository;
