import { FastifyRequest } from 'fastify'
import { InvalidToken } from '../errors'
import { TokenService } from '../services/token-service'
import { CustomerTokenPayload } from '../utils/customer-token-payload'

interface AccessTokenValidatedResponse {
  accessToken: string
}

export class EnsureAuthenticationMiddleware {
  constructor(
    private readonly tokenService: TokenService<CustomerTokenPayload>
  ) { }

  public handle = async (request: FastifyRequest): Promise<void> => {
    const headers = this.validateRequestHeader(request.headers)
    this.verifyAccessToken(headers.accessToken)
  }

  private validateRequestHeader(header: FastifyRequest['headers']): AccessTokenValidatedResponse {
    if (!header) {
      throw new InvalidToken()
    }

    const accessToken = header.authentication as string

    if (!accessToken) {
      throw new InvalidToken()
    }

    return { accessToken }
  }

  private verifyAccessToken(accessToken: string): void {
    try {
      this.tokenService.validateToken(accessToken)
    } catch {
      throw new InvalidToken()
    }
  }
}
