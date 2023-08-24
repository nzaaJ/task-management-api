import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'HomeController.index')

Route.group(() => {
  /* User routes */
  Route.post('/register', 'UsersController.register')
  Route.post('/login', 'UsersController.login')
}).middleware('guest')

Route.group(() => {
  /* Tasks routes */
  Route.get('/tasks', 'TasksController.index')
  Route.post('/tasks', 'TasksController.store')
  Route.patch('/tasks/:id', 'TasksController.update')
  Route.delete('/tasks/:id', 'TasksController.destroy')
  Route.get('/tasks/:id', 'TasksController.show')

  /* Logout route */
  Route.post('/logout', 'UsersController.logout')
}).prefix('api').middleware('auth')
