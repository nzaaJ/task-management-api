import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'

export default class UsersController {

    public async register({ request, response }: HttpContextContract) {
        const payload = await request.validate({ 
            schema: UserValidator.registerSchema,
            messages: UserValidator.messages
        })
        
        try {
            const user = new User()
            user.email = payload.email
            user.password = payload.password

            await user.save()

            return response.status(201).json({ message:'User registered successfully' })
        } catch (error) {
            return response.status(400).json({ errors: error.messages })
        }
    }

    public async login({ auth, request, response }: HttpContextContract) {
        const { email, password } = await request.validate({
            schema: UserValidator.loginSchema,
            messages: UserValidator.messages
        })

        try {
            const token = await auth.attempt(email, password)
            response.status(200).send({ token })
        } catch {
            return response.status(401).json({ error: 'Login failed' })
        }  
    }

    public async logout({auth, response }: HttpContextContract) {
        try {
            await auth.logout()

            return response.status(200).json({ message: 'Logged out successfully '})
        } catch {
            return response.status(500).json({ error: 'Error while logging out' })
        }
    }
}
