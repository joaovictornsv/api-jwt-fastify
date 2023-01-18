import { CustomerSafetyData } from '../dtos/customer-dtos'
import { Customer } from '../entities/customer'
import { CustomerNotFound } from '../errors'
import { CustomerRepository } from '../repositories/customer-repository'

interface PrivateResourceDependencies {
  customerRepository: CustomerRepository
}

export interface PrivateResourceRequest {
  customerId: string
}

export interface PrivateResourceResponse {
  customer: CustomerSafetyData
}

export class PrivateResourceUseCase {
  private readonly customerRepository: CustomerRepository

  constructor(dependencies: PrivateResourceDependencies) {
    this.customerRepository = dependencies.customerRepository
  }

  async execute(request: PrivateResourceRequest): Promise<PrivateResourceResponse> {
    const customer = await this.findCustomerById(request.customerId)

    const customerSafetyData = this.buildCustomerObjectResponse(customer)
    return customerSafetyData
  }

  private buildCustomerObjectResponse(rawCustomer: Customer): PrivateResourceResponse {
    return {
      customer: {
        username: rawCustomer.username,
        role: rawCustomer.role
      }
    }
  }

  private async findCustomerById(customerId: string): Promise<Customer> {
    const customerFound =
      await this.customerRepository.findById(customerId)

    if (!customerFound) {
      throw new CustomerNotFound()
    }

    return customerFound
  }
}
