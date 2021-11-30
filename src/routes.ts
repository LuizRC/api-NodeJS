import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { SurveyController } from "./controllers/SurveysController";
import { SendMailController } from "./controllers/SendMailController";
import { AnswerController } from "./controllers/AnswerController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMaillControler = new SendMailController();
const answerController = new AnswerController();

router.post("/users", userController.create);
router.get("/users", userController.show);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendMail", sendMaillControler.execute);

router.get("/answers/:value", answerController.execute);

export { router };