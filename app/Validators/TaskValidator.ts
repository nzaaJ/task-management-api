import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public static storeSchema = schema.create({
    taskName: schema.string({}, [rules.required()]),
    taskDescription: schema.string.optional(),
    isFinished: schema.boolean.optional()
  })

  public static updateSchema = schema.create({
    taskName: schema.string.optional(),
    taskDescription: schema.string.optional(),
    isFinished: schema.boolean.optional()
  })

  public static messages: CustomMessages = {
    'taskName.required': 'The task name is required.',
    'taskName.string': 'The task name must be a string.',
    'taskDescription.string': 'The task description must be a string.',
    'isFinished.boolean': 'The value of isFinished must be a boolean.',
  }
}
