import { Router } from 'express'
import environment from '../../environment'

export abstract class Routes {
  constructor(prefix, app) {
    let router = Router()
    this.defineRoutes(router)
    app.use(`${environment.apiBase}${prefix}`, router)
  }

  abstract defineRoutes(router: Router)
}
