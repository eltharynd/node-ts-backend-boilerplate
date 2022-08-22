import { Payments } from '../../../API/lib/payments.lib'

describe('STRIPE library', () => {
  let payments: Payments
  //TODO implement stripe unit testing

  beforeAll(() => {
    payments = new Payments()
  })
  it('should connect', () => {
    expect(true).toBe(true)
  })

  it('should retrieve products list', () => {
    expect(true).toBe(true)
  })
})
