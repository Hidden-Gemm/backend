import { Router } from "express"
import { AuthContoller } from "../controllers/auth.controller"

export const authRouter = () => {
    const router = Router()

    const authContoller = new AuthContoller()

    router.post("/apple", authContoller.signInWithApple)

    return router
}