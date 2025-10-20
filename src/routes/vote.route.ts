import { Router } from "express"
import { VoteController } from "../controllers/vote.controller"

export const voteRouter = () => {
    const router = Router()

    const voteController = new VoteController()

    router.post("/:eventSlug/:participantSlug", voteController.voteEvent)

    return router
}