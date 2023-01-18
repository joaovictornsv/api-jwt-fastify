import { app } from './app'
import { authRoutes } from './routers/auth-routes'

function setErrorHandler(): void {
  app.setErrorHandler(function (error, _, reply) {
    const statusCode = error.statusCode ?? 400
    reply.status(statusCode).send({ message: error.message })
  })
}

async function registerRoutes(): Promise<void> {
  await app.register(authRoutes)
}

async function serve(): Promise<void> {
  await app.listen({ port: 3000 })
  console.log('Server is running')
}

async function bootstrap(): Promise<void> {
  setErrorHandler()
  await registerRoutes()
  await serve()
}

const start = async (): Promise<void> => {
  try {
    await bootstrap()
  } catch (err: any) {
    app.log.error(err)
  }
}
start()
