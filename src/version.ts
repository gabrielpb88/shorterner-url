import { readFileSync } from 'fs'
import { join } from 'path'

interface VersionInfo {
  version: string
  name: string
  description: string
}

function getPackageInfo(): VersionInfo {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, process.env.NODE_ENV === 'production' ? '../../package.json' : '../package.json'), 'utf-8')
  )

  return {
    version: packageJson.version,
    name: packageJson.name,
    description: packageJson.description
  }
}

export const versionInfo = getPackageInfo()
