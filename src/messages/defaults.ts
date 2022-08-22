import { Response } from 'express'
import { words as capitalizeWords } from 'capitalize'

export const sendDefaultMessage = (res: Response, message: DefaultMessage) => {
  res.status(message.status).send(message)
}

/**
 * Express middleware to check the presence of all required parameters in body.
 *
 * @remarks If any of the specified parameters are missing from the request, returns a BAD_REQUEST with an array listing the missing parameters
 *
 * @param required - An array of strings listing the names of required parameters
 * @returns void (sends a 400 BAD_REQUEST response if not present)
 **/
export const requestBodyGuard = (required: string[]) => {
  return (req, res, next) => {
    if (!required || required.length === 0) return next()

    let missing = []
    for (let param of required) if (!req.body[param]) missing.push(param)
    if (missing.length === 0) return next()

    let string = ``
    for (let m of missing)
      string += `${string.length === 0 ? 'Missing parameters: ' : ''}${m}, `
    let message = new BAD_REQUEST(string.slice(0, -2))
    message.missing = missing
    return res.status(message.status).send(message)
  }
}

interface DefaultMessage {
  readonly localization: string
  readonly status: number
  message: string
}

export class OK implements DefaultMessage {
  readonly localization = 'OK'
  readonly status = 200
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class CREATED implements DefaultMessage {
  readonly localization = 'CREATED'
  readonly status = 201
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class ACCEPTED implements DefaultMessage {
  readonly localization = 'ACCEPTED'
  readonly status = 202
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class NO_CONTENT implements DefaultMessage {
  readonly localization = 'NO_CONTENT'
  readonly status = 204
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class PARTIAL_CONTENT implements DefaultMessage {
  readonly localization = 'PARTIAL_CONTENT'
  readonly status = 206
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class BAD_REQUEST implements DefaultMessage {
  readonly localization = 'BAD_REQUEST'
  readonly status = 400
  message
  missing
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class UNAUTHORIZED implements DefaultMessage {
  readonly localization = 'UNAUTHORIZED'
  readonly status = 401
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class FORBIDDEN implements DefaultMessage {
  readonly localization = 'FORBIDDEN'
  readonly status = 403
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class NOT_FOUND implements DefaultMessage {
  readonly localization = 'NOT_FOUND'
  readonly status = 404
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class METHOD_NOT_ALLOWED implements DefaultMessage {
  readonly localization = 'METHOD_NOT_ALLOWED'
  readonly status = 405
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class CONFLICT implements DefaultMessage {
  readonly localization = 'CONFLICT'
  readonly status = 409
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class GONE implements DefaultMessage {
  readonly localization = 'GONE'
  readonly status = 410
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}

export class INTERNAL_SERVER_ERROR implements DefaultMessage {
  readonly localization = 'INTERNAL_SERVER_ERROR'
  readonly status = 500
  message
  constructor(message?: string) {
    this.message =
      message || capitalizeWords(this.localization.replace(/\_/g, ' '))
  }
}
