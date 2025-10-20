import { NextFunction, Request, Response} from "express";
import { findEventByTitle } from "../utils/event.helper";
import { Prisma } from "@prisma/client";
import { prisma } from "../config";

export class EventController {
    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            

            const {
                title,
                // from event kit
            } = req.body;

            const existEvent = await findEventByTitle(title)
            if (existEvent) throw new Error("Event already exist")

            const data: Prisma.EventCreateInput = {
                title,
                // from event kit
            }

            const newEvent = await prisma.event.create({
                data,
                include: {
                    user: //wait for login
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