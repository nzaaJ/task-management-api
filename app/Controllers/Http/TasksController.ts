import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TaskValidator from 'App/Validators/TaskValidator'
import Task from "App/Models/Task"

export default class TasksController {

    /* Get all tasks */
    public async index({ response, auth }){
        await auth.authenticate()

        const user = auth.user
        if(!user) {
            return response.status(401).json({ error: 'Unauthorized access' })
        }

        try {
            const tasks = await Task.query()
                                .where('user_id', user.id)
                                .select(['id', 'task_name', 'task_description', 'is_finished', 'created_at', 'updated_at'])
            return tasks
        } catch {
            return response.status(500).json({ error: 'Internal Server Error' })
        }
    }

    /** Get task by ID */
    public async show({ response, auth, params }){
        await auth.authenticate()

        const user = auth.user
        if(!user) {
            return response.status(401).json({ error: 'Unauthorized access' })
        }

        try {
            const task = await Task.query()
                                    .where('id', params.id)
                                    .where('user_id', user.id)
                                    .select(['id', 'task_name', 'task_description', 'is_finished', 'created_at', 'updated_at'])
                                    .firstOrFail()
            return response.status(200).json({ task })
        } catch {
            return response.status(404).json({ error: 'Task not found' })
        }
    }

    /*** Create a new task */
    public async store({ request, response, auth }: HttpContextContract) {
        const user = await auth.authenticate()
        const payload = await request.validate({
            schema: TaskValidator.storeSchema,
            messages: TaskValidator.messages
        })

        try {
            const task = new Task()

            task.taskName = payload.taskName
            task.taskDescription = payload.taskDescription as string
            task.isFinished = payload.isFinished || false

            await user.related('tasks').save(task)

            return response.status(201).json({ message: 'Task Created' })
        } catch {
            return response.status(400).json({ errors: 'Task not found' })
        }
    } 

    /**** Update a task by ID */
    public async update({ request, response, params, auth }: HttpContextContract) {
        await auth.authenticate()
        const payload = await request.validate({
            schema: TaskValidator.updateSchema,
            messages: TaskValidator.messages
        })

        const user = auth.user
        if(!user) {
            return response.status(401).json({ error: 'Unauthorized access' })
        }

        try {
            const task = await Task.query()
                                    .where('id', params.id)
                                    .where('user_id', user.id)
                                    .firstOrFail()
            const originalTask = task.serialize()

            task.taskName = payload.taskName ?? task.taskName
            task.taskDescription = payload.taskDescription ?? task.taskDescription
            task.isFinished = payload.isFinished ?? task.isFinished

            await task.save()

            // check for changes after saving
            const updatedFields = {}
            if(payload.taskName !== originalTask.taskName){
                updatedFields['taskName'] = task.taskName
            }

            if(payload.taskDescription !== originalTask.taskDescription){
                updatedFields['taskDescription'] = task.taskDescription
            }

            if(payload.isFinished !== originalTask.isFinished){
                updatedFields['isFinished'] = task.isFinished
            }

            if (Object.keys(updatedFields).length > 0) {
                return response.status(200).json({ updatedFields }) // Return only updated fields
            } else {
                return response.status(200).json({ message: 'No changes were made to the task' })
            }

        } catch {
            return response.status(404).json({ error: 'Task not found' })
        }
    }

    /***** Delete task by ID */
    public async destroy({ response, params, auth }: HttpContextContract) {
        await auth.authenticate()
        
        const user = auth.user
        if(!user) {
            return response.json({ error: 'Unauthorized access' })
        }

        try {
            const task = await Task.query()
                                    .where('id', params.id)
                                    .where('user_id', user.id)
                                    .firstOrFail()
            await task.delete()

            return response.status(200).json({ message: 'Task Deleted' })
        } catch {
            return response.status(404).json({ error: 'Task not found'})
        }
    }
}