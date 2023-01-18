import { Customer } from '../entities/customer'
import { InvalidCustomerCredentials } from '../errors'
import { CustomerRepository } from '../repositories/customer-repository'
import { TokenService } from '../services/token-service'

interface CustomerTokenPayload {
  customer_id: string
}

interface LoginDependencies {
  customerRepository: CustomerRepository
  tokenService: TokenService<CustomerTokenPayload>
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export class LoginUseCase {
  private readonly customerRepository: CustomerRepository
  private readonly tokenService: TokenService<CustomerTokenPayload>

  constructor(dependencies: LoginDependencies) {
    this.customerRepository = dependencies.customerRepository
    this.tokenService = dependencies.tokenService
  }

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const customer = await this.findCustomerByUsername(request.username)

    const requestPassword = request.password
    const customerPassword = customer.password
    this.validatePassword(requestPassword, customerPassword)

    const tokenPayload = this.buildCustomerTokenPayload(customer.id)
    const tokenPair = this.tokenService.generateTokenPair(tokenPayload)
    return tokenPair
  }

  private async findCustomerByUsername(username: string): Promise<Customer> {
    const customerFound =
      await this.customerRepository.findByUsername(username)

    if (!customerFound) {
      throw new InvalidCustomerCredentials()
    }

    return customerFound
  }

  private validatePassword(
    requestPassword: string,
    customerPassword: string
  ): void {
    if (requestPassword !== customerPassword) {
      throw new InvalidCustomerCredentials()
    }
  }

  private buildCustomerTokenPayload(customerId: string): CustomerTokenPayload {
    return {
      customer_id: customerId
    }
  }
}
