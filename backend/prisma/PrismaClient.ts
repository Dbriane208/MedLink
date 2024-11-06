import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
    try {
        console.log("Connecting to the database...");
        await prisma.$connect();
        console.log("✅Database connected successfully🚀🚀");
    } catch (error) {
        console.error("✅Error connecting to the database❌❌");
    }
}

export const disconnectDatabase = async () => {
    try {
        console.log("Disconnecting from the database...");
        await prisma.$disconnect
        console.log("❎Database disconnected successfully🚀");
    } catch (error) {
        console.error("❎Error disconnecting from the database: ", error);
    }
}

export default prisma;