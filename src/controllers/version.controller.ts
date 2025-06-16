import { type Request, type Response } from 'express'
import { versionInfo } from '../version'

export class VersionController {
  getVersion(req: Request, res: Response): void {
    res.json(versionInfo)
  }
}
