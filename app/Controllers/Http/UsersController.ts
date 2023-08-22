import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {

  private registerValidationSchema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({table: 'users', column: 'email'})]),
    password: schema.string({}, [rules.confirmed()])
  })


    public async register({ request, response }: HttpContextContract) {
        try {
            const payload = await request.validate({ schema: this.registerValidationSchema });

            const user = new User();
            user.email = payload.email;
            user.password = payload.password;

            await user.save();

            return response.status(201).send('User registered successfully');
        } catch (error) {
            return response.status(400).json({ errors: error.messages });
        }
    }

    public async login({ auth, request, response }: HttpContextContract) {
        const { email, password } = request.all();

        try {
            const token = await auth.attempt(email, password);
            response.status(200).send({token});
        } catch {
            return response.status(401).send('Login failed');
        }
    }
}
