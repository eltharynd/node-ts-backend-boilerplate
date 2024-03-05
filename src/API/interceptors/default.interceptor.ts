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
  extra: any

  constructor(name: string, httpCode: number, message?: any, extra?: any) {
    this.name = name
    this.httpCode = httpCode
    this.message =
      message?.message || message || DefaultResponse.getDefaultMessage(name)
    this.extra = extra
  }

  static getDefaultMessage(name: string): string {
    return capitalizeWords(name.replace(/\_/g, ' '))
  }
}

class ErrorResponse extends HttpError {
  readonly name: string
  readonly httpCode: number
  message: string
  extra: any

  constructor(name: string, httpCode: number, message?: any, extra?: any) {
    super(
      httpCode,
      message?.message || message || DefaultResponse.getDefaultMessage(name)
    )
    this.name = name
    this.message =
      message?.message || message || DefaultResponse.getDefaultMessage(name)
    this.extra = extra
  }

  static getDefaultMessage(name: string): string {
    return capitalizeWords(name.replace(/\_/g, ' '))
  }
}

export class OK extends DefaultResponse {
  constructor(message?: string, extra?: any) {
    super('OK', 200, message, extra)
  }
}

export class CREATED extends DefaultResponse {
  constructor(message?: string, extra?: any) {
    super('CREATED', 201, message, extra)
  }
}

export class ACCEPTED extends DefaultResponse {
  constructor(message?: string, extra?: any) {
    super('ACCEPTED', 202, message, extra)
  }
}

export class NO_CONTENT extends DefaultResponse {
  constructor(message?: string, extra?: any) {
    super('NO_CONTENT', 204, message, extra)
  }
}

export class PARTIAL_CONTENT extends DefaultResponse {
  constructor(message?: string, extra?: any) {
    super('PARTIAL_CONTENT', 206, message, extra)
  }
}

export class BAD_REQUEST extends ErrorResponse {
  missing: any

  constructor(error?: Error | string, extra?: any) {
    super('BAD_REQUEST', 400, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('UNAUTHORIZED', 401, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('FORBIDDEN', 403, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('NOT_FOUND', 404, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('METHOD_NOT_ALLOWED', 405, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('CONFLICT', 409, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('GONE', 410, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super('UNPROCESSABLE_CONTENT', 422, error, extra)
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
  constructor(error?: Error | string, extra?: any) {
    super(
      'INTERNAL_SERVER_ERROR',
      500,
      typeof error === 'string' ? error : error?.message || '',
      extra
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
