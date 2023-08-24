import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public static registerSchema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({table: 'users', column: 'email'})]),
    password: schema.string({}, [rules.confirmed()])
  })

  public static loginSchema = schema.create({
    email: schema.string({}, [rules.email()]),
    password: schema.string({}, [rules.required()])
  })

  public static messages: CustomMessages = {
    'email.email': 'Please enter a valid email address.',
    'email.unique': 'This email is already in use.',
    'password.confirmed': 'Passwords do not match.',

    'loginSchema.email.email': 'Invalid email format for login.',
    'loginSchema.password.required': 'Password is required for login.'
  }
}
