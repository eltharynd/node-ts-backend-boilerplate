import { Request } from 'express'
import {
  SettingsPatchRequest,
  UserPatchRequest,
  UserPostRequest,
} from 'node-ts-backend-boilerplate-interfaces/requests'
import {
  PublicUserResponse,
  SettingsResponse,
  UserWithIdResponse,
} from 'node-ts-backend-boilerplate-interfaces/responses'
import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  Req,
  UseBefore,
} from 'routing-controllers'
import { ResponseSchema } from 'routing-controllers-openapi'
import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  UNPROCESSABLE_CONTENT,
} from '../interceptors/default.interceptor'
import { AdminGuard, OwnerOrAdminGuard } from '../middlewares/auth.middleware'
import { Users } from './users.model'

@JsonController(`/users`)
export class UsersController {
  @Get(`/`)
  @UseBefore(AdminGuard)
  @ResponseSchema(UserWithIdResponse, {
    isArray: true,
  })
  async getAllUsers() {
    return (await Users.find()).map((u) => {
      return { _id: u._id, ...u.public() }
    })
  }

  @Post(`/`)
  @HttpCode(201)
  @UseBefore(AdminGuard)
  @ResponseSchema(UserWithIdResponse)
  async createUser(@Body() body: UserPostRequest) {
    if (body.email.toLowerCase) body.email = body.email.toLowerCase()
    let user = await Users.create(body).catch((e) => {
      if (e?.code === 11000)
        throw new CONFLICT('User with this email already exists')
      throw new BAD_REQUEST(e.message)
    })

    return { _id: user._id, ...user.public() }
  }

  @Get(`/:userId`)
  @UseBefore(AdminGuard)
  @ResponseSchema(UserWithIdResponse)
  async getUser(@Param('userId') userId: string) {
    let user = await Users.findById(userId)
    if (!user) throw new NOT_FOUND()
    return {
      _id: user._id,
      ...user.public(),
    }
  }

  @Patch(`/:userId`)
  @UseBefore(OwnerOrAdminGuard)
  @ResponseSchema(PublicUserResponse)
  async updateUser(
    @Req() req: Request,
    @Body() body: UserPatchRequest,
    @Param('userId') userId: string
  ) {
    if (body.hasOwnProperty('admin') && !req.auth.admin)
      throw new FORBIDDEN(
        `You are not permitted to flag/unflag users as admins...`
      )

    let user = await Users.findById(userId)
    await user
      .set(body)
      .save()
      .catch((e) => {
        if (e?.code === 11000)
          throw new CONFLICT('Another user with this email already exists')
        throw new UNPROCESSABLE_CONTENT()
      })

    return user.public()
  }

  @Delete(`/:userId`)
  @UseBefore(OwnerOrAdminGuard)
  async deleteUser(@Param('userId') userId: string) {
    let user = await Users.findById(userId)
    if (!user) throw new NOT_FOUND()

    if (user.admin) throw new FORBIDDEN(`You cannot delete administrators...`)

    await user.deleteOne()
  }

  @Get(`/:userId/settings`)
  @UseBefore(OwnerOrAdminGuard)
  @ResponseSchema(SettingsResponse)
  async getUserSettings(@Param('userId') userId: string) {
    let user = await Users.findById(userId)
    return user.settings
  }

  @Patch(`/:userId/settings`)
  @UseBefore(OwnerOrAdminGuard)
  @ResponseSchema(SettingsResponse)
  async updateUserSettings(
    @Body() body: SettingsPatchRequest,
    @Param('userId') userId: string
  ) {
    let user = await Users.findById(userId)
    user.set('settings', body)
    await user.save()
    return user.settings
  }

  @Delete(`/:userId/settings`)
  @UseBefore(OwnerOrAdminGuard)
  async resetUserSettings(
    @Body() body: SettingsPatchRequest,
    @Param('userId') userId: string
  ) {
    let user = await Users.findById(userId)

    let asd = new Users()
    user.set('settings', asd.settings)
    await user.save()

    return user.settings
  }
}
