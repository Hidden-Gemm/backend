import { Router } from "express";
import { AasaController } from "../controllers/aasa.controller";

export const aasaRouter = () => {
  const router = Router();
  const aasaRouter = new AasaController();

  router.get("/.well-known/apple-app-site-association", aasaRouter.signAasaApple);

  return router;
};
