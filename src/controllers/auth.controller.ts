import { NextFunction, Request, Response } from "express";
import { APPLE_CLIENT_ID, JWT_SECRET_KEY, prisma } from "../config";
import appleSignIn from "apple-signin-auth";
import jwt from "jsonwebtoken";

export class AuthContoller {
    async signInWithApple(req: Request, res: Response, next: NextFunction) {
        try {
            
            const { id_token } = req.body;
            console.log(req.body)
            if (!id_token) throw new Error("Missing Apple ID token")

            const decoded = await appleSignIn.verifyIdToken(id_token, {
                audience: APPLE_CLIENT_ID,
                ignoreExpiration: false,
            })

            const appleId = decoded.sub
            const email = decoded.email || ""

            let user = await prisma.user.findUnique({
                where: { appleId }
            })

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        appleId,
                        email
                    }
                })
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    appleId: user.appleId,
                    email: user.email
                },
                JWT_SECRET_KEY,
                {
                    expiresIn: "7d"
                }
            )

            res.status(200).json({
                success: true,
                token,
                user
            })


        } catch (error) {
            next(error)
        }
    }
}