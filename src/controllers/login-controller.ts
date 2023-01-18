import { FastifyRequest } from 'fastify'
import { InvalidCustomerCredentials } from '../errors'
import { LoginRequest, LoginUseCase, LoginResponse } from '../usecases/login'

interface LoginControllerResponse {
  access_token: string
  refresh_token: string
}

export class LoginController {
  constructor(
    private readonly loginUseCase: LoginUseCase
  ) { }

  public handle = async (request: FastifyRequest): Promise<LoginControllerResponse> => {
    const body = this.validateRequestBody(request.body)
    const tokenPair = await this.loginUseCase.execute(body)

    const response = this.buildResponseToClient(tokenPair)
    return response
  }

  private validateRequestBody(body: any): LoginRequest {
    if (!body) {
      throw new InvalidCustomerCredentials()
    }

    const { username, password } = body

    if (!username || !password) {
      throw new InvalidCustomerCredentials()
    }

    return { username, password }
  }

  private buildResponseToClient(
    tokenPair: LoginResponse
  ): LoginControllerResponse {
    return {
      access_token: tokenPair.accessToken,
      refresh_token: tokenPair.refreshToken
    }
  }
}
