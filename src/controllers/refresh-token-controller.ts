import { FastifyRequest } from 'fastify'
import { InvalidToken } from '../errors'
import { RefreshTokenUseCase, RefreshTokenRequest } from '../usecases/refresh-token'

interface RefreshTokenControllerResponse {
  access_token: string
}

export class RefreshTokenController {
  constructor(
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) { }

  public handle = async (request: FastifyRequest): Promise<RefreshTokenControllerResponse> => {
    const header = this.validateRequestHeader(request.headers)
    const newToken = await this.refreshTokenUseCase.execute({
      refreshToken: header.refreshToken
    })

    const response = this.buildResponseToClient(newToken.accessToken)
    return response
  }

  private validateRequestHeader(header: FastifyRequest['headers']): RefreshTokenRequest {
    if (!header) {
      throw new InvalidToken()
    }

    const refreshToken = header.refresh_token as string

    if (!refreshToken) {
      throw new InvalidToken()
    }

    return { refreshToken }
  }

  private buildResponseToClient(
    accessToken: string
  ): RefreshTokenControllerResponse {
    return {
      access_token: accessToken
    }
  }
}
