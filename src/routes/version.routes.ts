import { Router } from 'express'
import { VersionController } from '../controllers/version.controller'

export function createVersionRoutes(): Router {
  const router = Router()
  const versionController = new VersionController()

  router.get('/', versionController.getVersion)

  return router
}
