/**
 * The current status of a STEX Order.
 * Only available inside of a STEXOrder object when the user confirms the stub and starts the submission process.
 */
export type STEXOrderStatus =
  | '00_ERROR'
  | '01_PROCESSING_STARTED'
  | '02_VERIFIED_LOCALLY'
  | '03_VERIFIED_WITH_AVALOQ'
  | '04_SENT_TO_AVALOQ'
  | '05_PROCESSED'

/**
 * A STEX order object for Avaloq
 */
export interface ISTEXOrder {
  _id?: string
  status?: STEXOrderStatus
  errorMessage?: string

  tradeType: string
  currency: string
  amount: string
  limit: string
  isin: string
  executionPlace: string
  limitDate: string
  account: string
  orderType: string
  orderDuration: string
  stopPrice: string
}

export class STEXOrder implements ISTEXOrder {
  _id?: string
  status?: STEXOrderStatus
  errorMessage?: string

  tradeType: string
  currency: string
  amount: string
  limit: string
  isin: string
  executionPlace: string
  limitDate: string
  account: string
  orderType: string
  orderDuration: string
  stopPrice: string

  constructor(stub: Partial<ISTEXOrder>) {
    this.tradeType = stub.tradeType
    this.currency = stub.currency
    this.amount = stub.amount
    this.limit = stub.limit
    this.isin = stub.isin
    this.executionPlace = stub.executionPlace
    this.limitDate = stub.limitDate
    this.account = stub.account
    this.orderType = stub.orderType
    this.orderDuration = stub.orderDuration
    this.stopPrice = stub.stopPrice
  }

  isValid(): boolean {
    if (
      !this.tradeType ||
      !this.currency ||
      !this.amount ||
      !this.limit ||
      !this.isin ||
      !this.executionPlace ||
      !this.limitDate ||
      !this.account ||
      !this.orderType ||
      !this.orderDuration ||
      !this.stopPrice
    )
      return false
    else return true
  }

  toJSON(): Partial<ISTEXOrder> {
    return {
      _id: this._id,
      status: this.status,
      errorMessage: this.errorMessage,
      tradeType: this.tradeType,
      currency: this.currency,
      amount: this.amount,
      limit: this.limit,
      isin: this.isin,
      executionPlace: this.executionPlace,
      limitDate: this.limitDate,
      account: this.account,
      orderType: this.orderType,
      stopPrice: this.stopPrice,
    }
  }
}
