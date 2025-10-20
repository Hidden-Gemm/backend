import { Router } from "express"
import { EventController } from "../controllers/event.controller"
import { verifyToken } from "../middlewares/auth.middleware"

export const eventRouter = () => {
    const router = Router()

    const eventController = new EventController()

    router.post("/", verifyToken, eventController.createEvent)
    router.get("/", verifyToken, eventController.getEvents)
    router.get("/:id", verifyToken, eventController.getEventById)
    router.delete("/:id", verifyToken, eventController.deteleEvent)
    router.patch("/:id", verifyToken, eventController.editEventById)

    return router
}