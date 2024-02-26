import { defaultMetadataStorage } from 'class-transformer/cjs/storage'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import {
  RoutingControllersOptions,
  getMetadataArgsStorage,
} from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import environment from '../environment'
import { AuthController } from './auth/auth.controller'
import { UploadsController } from './uploads/uploads.controller'
import { UsersController } from './users/users.controller'

const routingControllersOptions: RoutingControllersOptions = {
  controllers: [AuthController, UploadsController, UsersController],
  routePrefix: environment.API_BASE.replace(/\/$/, ''),
}
const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: '#/components/schemas/',
})
const storage = getMetadataArgsStorage()
export const SWAGGER_SPECS = routingControllersToSpec(
  storage,
  routingControllersOptions,
  {
    components: {
      //@ts-ignore
      schemas,
      securitySchemes: {
        basicAuth: {
          scheme: 'basic',
          type: 'http',
        },
      },
    },
    info: {
      description: 'Generated with `routing-controllers-openapi`',
      title: 'A sample API',
      version: '1.0.0',
    },
  }
)
