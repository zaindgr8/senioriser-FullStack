import prisma from "../utils/prisma";

export async function getCommunityBusinessinfoById(id) {
  try {
    const data = await prisma.communityBusinessinfo.findUnique({
      where: {
        id: id,
      },
      include: {
        businessDetails: true,
        amenities: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
      },
    });
    console.log(data);

    if (!data) {
      throw new Error("CommunityBusinessinfo not found");
    }

    return data;
  } catch (error) {
    console.error("Error fetching CommunityBusinessinfo:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getEventById(id) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}

// Function to update an event by ID
export async function updateEventById(id, data) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    return updatedEvent;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

// Function to get all events
export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany();
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
}

export async function getAllCommunityBusinessInfoWithRelations() {
  try {
    const communityBusinessInfos = await prisma.communityBusinessinfo.findMany({
      include: {
        businessDetails: true,
        amenities: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
        userauth: true, // Assuming you might also want to include the associated user
      },
    });

    return communityBusinessInfos;
  } catch (error) {
    console.error("Error fetching CommunityBusinessinfo:", error);
    throw new Error("Failed to fetch CommunityBusinessinfo");
  }
}
export async function getCommunityBusinesses() {
  try {
    const communityBusinesses = await prisma.communityBusinessinfo.findMany({
      include: {
        amenities: true,
        businessDetails: true,
        specialties: true,
        pricing: true,
        propertyImages: true,
        userauth: true,
      },
    });
    console.log("communityBusinesses", communityBusinesses);
    return { data: communityBusinesses };
  } catch (error) {
    return { error: error.message };
  }
}
