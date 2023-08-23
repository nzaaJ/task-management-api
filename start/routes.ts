/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import UsersController from 'App/Controllers/Http/UsersController'
// import TasksController from 'App/Controllers/Http/TasksController'

Route.get('/', 'HomeController.index')

  // User routes
Route.post('/register', 'UsersController.register')
Route.post('/login', 'UsersController.login').middleware('guest')

Route.group(() => {
  // Tasks routes
  Route.get('/tasks', 'TasksController.index')
  Route.post('/tasks', 'TasksController.store')
  Route.patch('/tasks/:id', 'TasksController.update')
  Route.delete('/tasks/:id', 'TasksController.destroy')
  Route.get('/tasks/:id', 'TasksController.show')

  // Logout route
  Route.post('/logout', 'UsersController.logout')
}).prefix('api').middleware('auth')
