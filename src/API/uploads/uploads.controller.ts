import { Request, Response } from 'express'
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers'
import { Readable } from 'stream'
import { Mongo } from '../../mongo'
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../interceptors/default.interceptor'
import { AuthGuard } from '../middlewares/auth.middleware'
import { uploadsMiddleware } from '../middlewares/multer.middleware'

@Controller(`/uploads`)
export class UploadsController {
  @Get(`/:fileId`)
  @UseBefore(AuthGuard)
  async download(
    @Req() req: Request,
    @Res() res: Response,
    @Param('fileId') fileId: string
  ) {
    let cursor = Mongo.Uploads.find({
      'metadata.user': req.auth._id,
      _id: Mongo.ObjectId(fileId),
    })

    if (!(await cursor.hasNext())) throw new NOT_FOUND()

    for await (let file of cursor) {
      return new Promise<Response>((resolve, reject) => {
        let readStream = Mongo.Uploads.openDownloadStream(file._id)

        res.set({
          'Content-Disposition': `attachment; filename="${file.metadata.originalname}"`,
          'content-type': file.metadata.contentType,
          'Last-modified': file.uploadDate.toUTCString(),
        })
        readStream.on('error', (e) => {
          reject(new INTERNAL_SERVER_ERROR(e))
        })
        readStream.on('end', () => {
          resolve(res)
        })

        readStream.pipe(res)
      })
    }
  }

  @Post(`/`)
  @UseBefore(AuthGuard)
  @UseBefore(uploadsMiddleware)
  async upload(@Req() req: any) {
    if (!req.file)
      throw new BAD_REQUEST(`You didn't send a file with your request...`)

    let files = await Mongo.Uploads.find({
      'metadata.user': req.auth._id,
      'metadata.originalname': req.file.originalname,
      'metadata.chat': { $exists: false },
    }).toArray()

    for (let file of files) {
      await Mongo.Uploads.delete(file._id)
    }

    let readStream = Readable.from(req.file.buffer)

    return new Promise<any>(async (resolve, reject) => {
      readStream.on('error', (e) => {
        reject(new INTERNAL_SERVER_ERROR(e))
      })

      let stream = Mongo.Uploads.openUploadStream(req.file.originalname, {
        chunkSizeBytes: 1048576,
        metadata: {
          user: Mongo.ObjectId(req.user.userid),
          originalname: req.file.originalname,
          contentType: req.file.mimetype,
        },
      }).on('finish', () => {
        if (!stream.errored) resolve({ _id: stream.id.toString() })
      })

      readStream.pipe(stream)
    })
  }
}

/* import { Router } from 'express'
import { Readable } from 'stream'
import { Mongo } from '../../db/mongo'
import {
  BAD_REQUEST,
  DEF,
  INTERNAL_SERVER_ERROR,
} from '../../util/defaultMessages'
import { uploadsMiddleware } from '../../util/multerMiddleware'
import { authGuard } from '../middlewares/auth.middleware'

export const router = Router()

router.get(`/:fileId`, authGuard, async (req, res) => {
  let cursor = Mongo.Uploads.find({
    'metadata.user': Mongo.ObjectId(req.user.userid),
    _id: Mongo.ObjectId(req.params.fileId),
  })

  if (!(await cursor.hasNext())) return res.default(DEF.NOT_FOUND)

  for await (let file of cursor) {
    res.set({
      'Content-Disposition': `attachment; filename="${file.metadata.originalname}"`,
      'content-type': file.metadata.contentType,
      'Last-modified': file.uploadDate.toUTCString(),
    })

    let readStream = Mongo.Uploads.openDownloadStream(file._id)
    readStream.on('data', (chunk) => {
      res.write(chunk)
    })
    readStream.on('end', () => {
      res.status(200).end()
    })
    readStream.on('error', (e) => {
      res.default(new INTERNAL_SERVER_ERROR(e.message))
    })
    break
  }
})

})
 */
