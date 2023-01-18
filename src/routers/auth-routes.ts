import { FastifyInstance } from 'fastify'
import { LoginController } from '../controllers/login-controller'
import { PrivateResourceController } from '../controllers/private-resource-controller'
import { RefreshTokenController } from '../controllers/refresh-token-controller'
import { EnsureAuthenticationMiddleware } from '../middlewares/ensure-authentication'
import { InMemoryCustomerRepository } from '../repositories/customer-repository'
import { TokenService } from '../services/token-service'
import { LoginUseCase } from '../usecases/login'
import { PrivateResourceUseCase } from '../usecases/private-resource'
import { RefreshTokenUseCase } from '../usecases/refresh-token'
import { CustomerTokenPayload } from '../utils/customer-token-payload'

const inMemoryCustomerRepository = new InMemoryCustomerRepository()
const tokenService = new TokenService<CustomerTokenPayload>()

const loginUseCase = new LoginUseCase({
  customerRepository: inMemoryCustomerRepository,
  tokenService
})
const refreshTokenUseCase = new RefreshTokenUseCase({
  customerRepository: inMemoryCustomerRepository,
  tokenService
})
const privateResourceUseCase = new PrivateResourceUseCase({
  customerRepository: inMemoryCustomerRepository
})

const loginController = new LoginController(loginUseCase)
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase)
const privateResourceControler = new PrivateResourceController(privateResourceUseCase)

const ensureAuthenticationMiddleware = new EnsureAuthenticationMiddleware(tokenService)

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/login', loginController.handle)
  fastify.post('/refresh_token', refreshTokenController.handle)
  fastify.get(
    '/customers/:customer_id',
    { preHandler: ensureAuthenticationMiddleware.handle },
    privateResourceControler.handle
  )
}
