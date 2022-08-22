import { Stripe } from 'stripe'
import environment from '../../environment'

export class Payments {
  stripe = new Stripe(environment.stripeAPIKey, {
    apiVersion: '2022-08-01',
  })
  products: Stripe.Product[]

  private async fetchProducts() {
    let response = await this.stripe.products.list()
    this.products = response?.data
    if (this.products?.length === 0) await this.populateProductsSample()
  }

  //TODO this is just a sample. Define and populate with the actual products/prices
  private async populateProductsSample() {
    let subscription = await this.stripe.products.create({
      name: 'Twitch Subscription',
      description: '$5.99/Month Subscription to support the conzent creator',
    })
    this.stripe.prices.create({
      unit_amount: 599,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      product: subscription.id,
    })
    subscription.default_price = await this.stripe.prices.create({
      unit_amount: 599,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      product: subscription.id,
    })

    let donation = await this.stripe.products.create({
      name: 'Twitch Donation',
      description: 'Give the streamer 1$ to buy a coffee',
    })
    donation.default_price = await this.stripe.prices.create({
      unit_amount: 100,
      currency: 'usd',
      product: donation.id,
    })

    this.products.push(subscription)
    this.products.push(donation)
  }

  /**
   * Creates a checkout session for the provided cart
   *
   * @param cart - An array of items that compose the cart
   * @returns the checkout session, use this to redirect `res.redirect(303, session.url)`
   * **/
  async createCheckoutSession(
    cart: Stripe.Checkout.SessionCreateParams.LineItem[]
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return await this.stripe.checkout.sessions.create({
      line_items: cart,
      mode: 'payment',
      success_url: `http://localhost:4200/success.html`,
      cancel_url: `http://localhost:4200/cancel.html`,
    })
  }
}
