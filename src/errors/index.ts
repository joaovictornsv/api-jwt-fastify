export class InvalidCustomerCredentials extends Error {
  constructor() {
    super('Invalid customer credentials')
  }
}

export class InvalidToken extends Error {
  constructor() {
    super('Invalid token')
  }
}

export class CustomerNotFound extends Error {
  constructor() {
    super('Customer not found')
  }
}
