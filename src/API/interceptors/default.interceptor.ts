import capitalizeWords from 'capitalize'
import {
  Action,
  HttpError,
  Interceptor,
  InterceptorInterface,
} from 'routing-controllers'

@Interceptor()
export class DefaultInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    if (content instanceof DefaultResponse) {
      action.response.status(content.httpCode)
    } else if (!content) {
      content = new OK()
    }
    return content
  }
}

class DefaultResponse {
  readonly name: string
  readonly httpCode: number
  message: string

  constructor(name: string, httpCode: number, message?: any) {
    this.name = name
    this.httpCode = httpCode
    this.message =
      message?.message || message || DefaultResponse.getDefaultMessage(name)
  }

  static getDefaultMessage(name: string): string {
    return capitalizeWords(name.replace(/\_/g, ' '))
  }
}

class ErrorResponse extends HttpError {
  readonly name: string
  readonly httpCode: number
  message: string

  constructor(name: string, httpCode: number, message?: any) {
    super(
      httpCode,
      message?.message || message || DefaultResponse.getDefaultMessage(name)
    )
    this.name = name
    this.message =
      message?.message || message || DefaultResponse.getDefaultMessage(name)
  }

  static getDefaultMessage(name: string): string {
    return capitalizeWords(name.replace(/\_/g, ' '))
  }
}

export class OK extends DefaultResponse {
  constructor(message?: string) {
    super('OK', 200, message)
  }
}

export class CREATED extends DefaultResponse {
  constructor(message?: string) {
    super('CREATED', 201, message)
  }
}

export class ACCEPTED extends DefaultResponse {
  constructor(message?: string) {
    super('ACCEPTED', 202, message)
  }
}

export class NO_CONTENT extends DefaultResponse {
  constructor(message?: string) {
    super('NO_CONTENT', 204, message)
  }
}

export class PARTIAL_CONTENT extends DefaultResponse {
  constructor(message?: string) {
    super('PARTIAL_CONTENT', 206, message)
  }
}

export class BAD_REQUEST extends ErrorResponse {
  missing: any

  constructor(error?: Error | string) {
    super('BAD_REQUEST', 400, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class UNAUTHORIZED extends ErrorResponse {
  constructor(error?: Error | string) {
    super('UNAUTHORIZED', 401, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class FORBIDDEN extends ErrorResponse {
  constructor(error?: Error | string) {
    super('FORBIDDEN', 403, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class NOT_FOUND extends ErrorResponse {
  constructor(error?: Error | string) {
    super('NOT_FOUND', 404, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class METHOD_NOT_ALLOWED extends ErrorResponse {
  constructor(error?: Error | string) {
    super('METHOD_NOT_ALLOWED', 405, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class CONFLICT extends ErrorResponse {
  constructor(error?: Error | string) {
    super('CONFLICT', 409, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class GONE extends ErrorResponse {
  constructor(error?: Error | string) {
    super('GONE', 410, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class UNPROCESSABLE_CONTENT extends ErrorResponse {
  constructor(error?: Error | string) {
    super('UNPROCESSABLE_CONTENT', 422, error)
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}

export class INTERNAL_SERVER_ERROR extends ErrorResponse {
  constructor(error?: Error | string) {
    super(
      'INTERNAL_SERVER_ERROR',
      500,
      typeof error === 'string' ? error : error?.message || ''
    )
    if (error instanceof Error) this.stack = error.stack
    else {
      let err = new Error(error)
      let lines: string[] = err.stack.split('\n')
      lines.splice(1, 3)
      this.stack = lines.join('\n')
    }
  }
}
