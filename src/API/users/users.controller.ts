import { Request } from 'express'
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
import {
  SettingsPatchRequest,
  UserPatchRequest,
  UserPostRequest,
} from '../../../interfaces/dist/index'
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  UNPROCESSABLE_CONTENT,
} from '../interceptors/default.interceptor'
import { AdminGuard, OwnerOrAdminGuard } from '../middlewares/auth.middleware'
import { Users } from './users.model'

@JsonController(`/users`)
export class UsersController {
  @Get(`/`)
  @UseBefore(AdminGuard)
  async getAllUsers() {
    return (await Users.find()).map((u) => {
      return { _id: u._id, ...u.public() }
    })
  }

  @Post(`/`)
  @HttpCode(201)
  @UseBefore(AdminGuard)
  async createUser(@Body() body: UserPostRequest) {
    let user = await Users.create(body).catch((e) => {
      if (e?.code === 11000)
        throw new CONFLICT('User with this email already exists')
      throw new BAD_REQUEST(e.message)
    })

    return { _id: user._id, ...user.public() }
  }

  @Get(`/:userId`)
  @UseBefore(AdminGuard)
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
  async updateUser(
    @Req() req: Request,
    @Body() body: UserPatchRequest,
    @Param('userId') userId: string
  ) {
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
    await user.deleteOne()
  }

  @Get(`/:userId/settings`)
  @UseBefore(OwnerOrAdminGuard)
  async getUserSettings(@Param('userId') userId: string) {
    let user = await Users.findById(userId)
    return user.settings
  }

  @Patch(`/:userId/settings`)
  @UseBefore(OwnerOrAdminGuard)
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
