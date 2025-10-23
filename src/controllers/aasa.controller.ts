import { NextFunction, Request, Response } from "express";

export class AasaController{
    async signAasaApple(req: Request, res: Response, next: NextFunction) {
        try {
            
            const aasa = {
                applinks: {
                    apps: ["mario-pan.Coordiy"],
                },
                appclips: {
                    apps: ["mario-pan.Coordiy.Clip"]
                }
            }

            res.setHeader("Content-Type", "application/json");
            res.status(200).json(aasa);

        } catch (error) {
            next(error)
        }
    }   
}