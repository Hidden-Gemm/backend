import { prisma } from "../config"

export const findEventByTitle = async (title: string) => {
    return await prisma.event.findUnique({
        where: {
            title
        }
    })
}