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
}