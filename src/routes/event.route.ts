import { Router } from "express"
import { EventController } from "../controllers/event.controller"
import { verifyToken } from "../middlewares/auth.middleware"

export const eventRouter = () => {
    const router = Router()

    const eventController = new EventController()

    router.post("/", verifyToken, eventController.createEvent)

    return router
}