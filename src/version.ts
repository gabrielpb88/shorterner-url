import { readFileSync } from 'fs'
import { join } from 'path'

interface VersionInfo {
  version: string
  name: string
  description: string
  buildDate: string
  commitHash?: string
}

function getPackageInfo(): VersionInfo {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '../../package.json'), 'utf-8')
  )

  return {
    version: packageJson.version,
    name: packageJson.name,
    description: packageJson.description,
    buildDate: process.env.BUILD_DATE,
    commitHash: process.env.COMMIT_HASH
  }
}

export const versionInfo = getPackageInfo()
