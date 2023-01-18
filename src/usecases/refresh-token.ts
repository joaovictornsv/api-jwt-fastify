import { Customer } from '../entities/customer'
import { InvalidToken } from '../errors'
import { CustomerRepository } from '../repositories/customer-repository'
import { TokenService } from '../services/token-service'

interface CustomerTokenPayload {
  customer_id: string
}

interface RefreshTokenDependencies {
  customerRepository: CustomerRepository
  tokenService: TokenService<CustomerTokenPayload>
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export class RefreshTokenUseCase {
  private readonly customerRepository: CustomerRepository
  private readonly tokenService: TokenService<CustomerTokenPayload>

  constructor(dependencies: RefreshTokenDependencies) {
    this.customerRepository = dependencies.customerRepository
    this.tokenService = dependencies.tokenService
  }

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const refreshTokenDecoded = this.verifyRefreshToken(request.refreshToken)

    const customerId = refreshTokenDecoded.customer_id
    await this.verifyIfCustomerExists(customerId)

    const tokenPayload = this.buildCustomerTokenPayload(customerId)
    const newAccessToken = this.tokenService.generateAccessToken(tokenPayload)
    return {
      accessToken: newAccessToken
    }
  }

  private async verifyIfCustomerExists(customerId: string): Promise<Customer> {
    const customerFound =
      await this.customerRepository.findById(customerId)

    if (!customerFound) {
      throw new InvalidToken()
    }

    return customerFound
  }

  private buildCustomerTokenPayload(customerId: string): CustomerTokenPayload {
    return {
      customer_id: customerId
    }
  }

  private verifyRefreshToken(refreshToken: string): CustomerTokenPayload {
    try {
      const refreshTokenDecoded = this.tokenService.validateToken(refreshToken)
      return refreshTokenDecoded
    } catch {
      throw new InvalidToken()
    }
  }
}
