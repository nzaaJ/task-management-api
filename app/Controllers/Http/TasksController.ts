import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Task from "App/Models/Task"

export default class TasksController {
    
    private validationSchema = schema.create({
        taskName: schema.string({}, [rules.required()]),
        taskDescription: schema.string.optional(),
        isFinished: schema.boolean.optional()
    })


    /* Get all tasks */
    public async index(){
        return Task.all()
    }

    /** Create a new task */

    public async store({request, response}: HttpContextContract) {
        try {
            const payload = await request.validate({schema: this.validationSchema})

            const task = new Task()

            // const {taskName, taskDescription} = request.all()
            task.taskName = payload.taskName
            task.taskDescription = payload.taskDescription as string

            await task.save()

            return response.status(201).send('Task Created')
        } catch {
            return response.status(400).send('Bad Request: The field "taskName" is not nullable')
        }
    } 

    /** Update a task by ID */
    public async update({request, response, params}: HttpContextContract) {
        try {
            const payload = await request.validate({schema: this.validationSchema})

            const task = await Task.findOrFail(params.id)
        
            // const {taskName, taskDescription, isFinished} = request.all()
            if(payload.taskName !== undefined){
                task.taskName = payload.taskName
            }

            if(payload.taskDescription !== undefined){
                task.taskDescription = payload.taskDescription
            }

            if(payload.isFinished !== undefined){
                task.isFinished = payload.isFinished
            }

            await task.save()

            return response.status(200).json({ task })
        } catch {
            return response.status(404).send('Task not found')
        }
    }

}
