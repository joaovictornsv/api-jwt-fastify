import { FastifyRequest } from 'fastify'
import { CustomerSafetyData } from '../dtos/customer-dtos'
import { InvalidCustomerCredentials } from '../errors'
import { PrivateResourceUseCase, PrivateResourceRequest } from '../usecases/private-resource'

interface PrivateResourceControllerResponse {
  customer: CustomerSafetyData
}

export class PrivateResourceController {
  constructor(
    private readonly privateResourceUseCase: PrivateResourceUseCase
  ) { }

  public handle = async (request: FastifyRequest): Promise<PrivateResourceControllerResponse> => {
    const params = this.validateRequestParams(request.params)
    const customerSafetyData = await this.privateResourceUseCase.execute(params)

    return customerSafetyData
  }

  private validateRequestParams(params: any): PrivateResourceRequest {
    if (!params) {
      throw new InvalidCustomerCredentials()
    }

    const customerId = params.customer_id

    if (!customerId) {
      throw new InvalidCustomerCredentials()
    }

    return { customerId }
  }
}
