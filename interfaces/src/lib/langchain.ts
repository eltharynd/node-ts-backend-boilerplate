import {
  AIMessage,
  BaseMessageFields,
  HumanMessage,
} from '@langchain/core/messages'
import { Types } from 'mongoose'
import { ISTEXOrder } from './avaloq'
export {
  AIMessage,
  BaseMessage,
  BaseMessageFields,
  SystemMessage,
} from '@langchain/core/messages'

export const enum UseCases {
  GENERATE_STOCK_EXCHANGE_ORDER = 'GENERATE_STOCK_EXCHANGE_ORDER',
  GENERATE_PAYMENT = 'GENERATE_PAYMENT',
  SEARCH_PAYMENT = 'SEARCH_PAYMENT',
  CHANGE_ORDER = 'CHANGE_ORDER',
  SWAP_TO_OTHER_VIEW = 'SWAP_TO_OTHER_VIEW',
  GENERAL_OTHER_QUESTION = 'GENERAL_OTHER_QUESTION',
}

/**
 * An AIMessage that also contains the sourceDocuments
 */
export class RetrievalMessage extends AIMessage {
  sourceDocuments?: {
    name: string
    path: string
    loc: {
      pageNumber: number
      lines: {
        from: number
        to: number
      }
    }
  }[]

  constructor(
    fields: string | BaseMessageFields,
    sourceDocuments: {
      name: string
      path: string
      loc: {
        pageNumber: number
        lines: {
          from: number
          to: number
        }
      }
    }[],
    kwargs?: Record<string, unknown>
  ) {
    super(fields)
    this.sourceDocuments = sourceDocuments
  }

  toJSON() {
    return { ...super.toJSON(), sourceDocuments: this.sourceDocuments }
  }
}

/**
 * A HumanMessage that also contains an uploaded file
 */
export class UploadMessage extends HumanMessage {
  uploadedFile: {
    _id: Types.ObjectId | string
    filename: string
    contentType: string
  }

  constructor(
    fields: string | BaseMessageFields,
    uploadedFile: {
      _id: Types.ObjectId | string
      filename: string
      contentType: string
    },
    kwargs?: Record<string, unknown>
  ) {
    super(fields)
    this.uploadedFile = uploadedFile
  }

  toJSON() {
    return { ...super.toJSON(), uploadedFile: this.uploadedFile }
  }
}

/**
 * An AIMessage that also contains the sourceDocuments
 */
export class STEXMessage extends AIMessage {
  STEXStub?: Partial<ISTEXOrder>[]

  constructor(
    fields: string | BaseMessageFields,
    STEXStub: Partial<ISTEXOrder>[],
    kwargs?: Record<string, unknown>
  ) {
    super(fields)
    this.STEXStub = STEXStub
  }

  toJSON() {
    return { ...super.toJSON(), STEXStub: this.STEXStub }
  }
}
