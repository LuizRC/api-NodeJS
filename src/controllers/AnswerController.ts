import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { AppError } from '../errors/AppError';


class AnswerController {

    //http://localhost:3333/answers/1?u=d7ae49c2-809d-4b07-8848-a8798cb5016f

    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            throw new AppError("Survey User does no exists!!");

        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);

    }
}

export { AnswerController }