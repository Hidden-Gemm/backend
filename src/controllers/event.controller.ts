import { NextFunction, Request, Response} from "express";
import { findEventByTitle } from "../utils/event.helper";
import { Prisma } from "@prisma/client";
import { DOMAIN_NAME, prisma } from "../config";
import { formatToSlug } from "../utils/link.helper";

export class EventController {
    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                title,
                notes,
                date,
                status,
                estimatedTime,
                priority,
                timezone,
                availableTimes,
                participants,
            } = req.body;

            const userId = req.user?.id;
            const existEvent = await findEventByTitle(title)
            if (existEvent) throw new Error("Event already exist")

            const data: Prisma.EventCreateInput = {
                title,
                availableTimes,
                date,
                estimatedTime,
                status,
                timezone,
                notes,
                priority,
                user: {
                    connect: {
                        id: userId
                    }
                },
                participants: {
                    create: participants.map((name: string) => {
                        return {
                            name,
                            email: null,
                            link: `${DOMAIN_NAME}${formatToSlug(title)}/${formatToSlug(name)}`,
                            status: "PENDING",
                            selectedTimes: []
                        };
                    })
                }
            }

            const newEvent = await prisma.event.create({
                data,
                include: {
                    user: {
                        select: {
                            email: true,
                        }
                    },
                    participants: {
                        select: {
                            name: true,
                            email: true,
                            link: true
                        }
                    }
                }
            })

            res.status(201).send({
                message: "success",
                data: newEvent
            })

        } catch (error) {
            next(error)
        }
    }

    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const { name, year, month, day } = req.query;

            let dateFilter: any = {};

            if (year && month && day) {
                const startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
                const endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
                dateFilter.createdAt = { gte: startDate, lte: endDate };
            } else if (year && month) {
                const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
                const endDate = new Date(`${year}-${month}-31T23:59:59.999Z`);
                dateFilter.createdAt = { gte: startDate, lte: endDate };
            } else if (year) {
                const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
                const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
                dateFilter.createdAt = { gte: startDate, lte: endDate };
            }

            let filter: any = {
                userId,
                ...dateFilter,
            };
        
            if (name) {
                filter.name = { contains: String(name), mode: 'insensitive' };
            }

            const data = await prisma.event.findMany({
                include: {
                    user: {
                        select : {
                            id: true,
                            email: true
                        }   
                    }
                },
                where: filter
            })

            res.status(200).send({
                message: "success",
                data
            })

        } catch (error) {
            next(error)
        }
    }
    
    async getEventById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const userId = req.user?.id

            const existEvent = await prisma.event.findUnique({
                where: {
                    id,
                    userId
                },
                include: {
                    participants: true
                }
            })

            if (!existEvent) throw new Error(`Event with ID: ${id} not found`)
            res.status(200).send({
                message: "success",
                data: existEvent
            })
        } catch (error) {
            next(error)
        }
    }

    async deteleEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const userId = req.user?.id
            const eventExist = await prisma.event.findUnique({
                where: {
                    id,
                    userId,
                },
            })
            if(!eventExist) throw new Error(`Event with ID ${id} already deleted`)
            await prisma.event.delete({
                where: {
                    id
                }
            })

            res.status(200).send({
                message: "Event has been deleted successfully"
            })
        } catch (error) {
            next(error)
        }
    }
}