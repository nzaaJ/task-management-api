import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Task from "App/Models/Task"

export default class TasksController {
    
    // validator for store method
    private storeValidationSchema = schema.create({
        taskName: schema.string({}, [rules.required()]),
        taskDescription: schema.string.optional(),
        isFinished: schema.boolean.optional()
    })
    
    // validator for update method
    private updateValidationSchema = schema.create({
        taskName: schema.string.optional(),
        taskDescription: schema.string.optional(),
        isFinished: schema.boolean.optional(),
    });

    /* Get all tasks */
    public async index(){
        return Task.all()
    }

    /** Get task by ID */
    public async show({response, params}){
        try {
            const task = await Task.findOrFail(params.id)

            return response.status(200).json({ task })
        } catch {
            return response.status(404).send('Task not found')
        }
    }

    /*** Create a new task */
    public async store({request, response}: HttpContextContract) {
        try {
            const payload = await request.validate({schema: this.storeValidationSchema})

            const task = new Task()

            task.taskName = payload.taskName
            task.taskDescription = payload.taskDescription as string

            await task.save()

            return response.status(201).send('Task Created')
        } catch {
            return response.status(400).send('Bad Request: Invalid input data')
        }
    } 

    /**** Update a task by ID */
    public async update({request, response, params}: HttpContextContract) {
        try {
            const payload = await request.validate({schema: this.updateValidationSchema})

            
            const task = await Task.findOrFail(params.id)

            if(payload.taskName !== undefined){
                task.taskName = payload.taskName
            }

            if(payload.taskDescription !== undefined){
                task.taskDescription = payload.taskDescription
            }

            if(payload.isFinished !== undefined){
                task.isFinished = payload.isFinished
            }

            //if any field is updated, save task
            await task.save()

            return response.status(200).json({ task })
        } catch {
            // if(error.messages){
            //     return response.status(400).json({errors: error.messages})
            // }
            return response.status(404).send('Task not found')
        }
    }

    /***** Delete task by ID */
    public async destroy({ response, params }: HttpContextContract) {
        try {
            const task = await Task.findOrFail(params.id)

            await task.delete()

            return response.status(200).send('Task Deleted')
        } catch {
            return response.status(404).send('Task not found')
        }
    }
}
