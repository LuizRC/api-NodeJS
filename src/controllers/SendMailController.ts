import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists",
            });

        }

        const surveyAlreadyExists = await surveyRepository.findOne({ id: survey_id });

        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: "Survey does not exists",
            })
        }

        const variables = {
            name: userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            user_id: userAlreadyExists.id,
            link: process.env.URL_MAIL,
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{ user_id: userAlreadyExists.id }, { value: null }],
            relations: ["user", "survey"],
        });

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);

            return response.json(surveyUserAlreadyExists);
        }


        //Salva as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);

        //Enviar email para o usuário

        await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath)

        return response.json(surveyUser);
    }
}

export { SendMailController };