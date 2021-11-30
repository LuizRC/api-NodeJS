import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    })

    //if(!(await schema.isValid(request.body))) {
    //  response.status(400).json({
    //    error: "Validation Failed!"
    //  })
    //}

    try {
      await schema.validate(request.body, { abortEarly: false});
    } catch (err) {
      response.status(400).json({
          error: err
        })
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const usersAlreadyExists = await usersRepository.findOne({
      email
    });

    if (usersAlreadyExists) {
      return response.status(400).json({
        error: "User already exists! - Usuário já existe!!",

      })
    }

    const user = usersRepository.create({
      name, email
    })

    await usersRepository.save(user);


    return response.status(201).json(user);

  }

  async show(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    const all = await usersRepository.find();
    return response.json(all);

  }

}

export { UserController };
