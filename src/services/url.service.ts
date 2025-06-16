import { type Collection } from 'mongodb'
import { type Url } from '../interfaces/url.interface'
import { logger } from '../logger'

export class UrlService {
  constructor(private readonly collection: Collection<Url>) {}

  async getOriginalUrl(shortUrl: string): Promise<string | undefined> {
    return (await this.collection.findOne({ shortUrl }))?.original
  }

  async shortenUrl(originalUrl: string): Promise<string> {
    const shortUrl = this.generateShortUrl()
    const expirationTimeInDays = +process.env.EXPIRATION_TIME
    const expirationTimeInMilliseconds =
      expirationTimeInDays * 24 * 60 * 60 * 1000

    const urlData: Url = {
      original: originalUrl,
      shortUrl,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expirationTimeInMilliseconds),
    }

    await this.collection.insertOne(urlData)
    return shortUrl
  }

  async deleteExpiredUrls(): Promise<void> {
    const now = new Date(Date.now())
    const result = await this.collection.deleteMany({
      expiresAt: { $lt: now },
    })
    logger.info(`Deleted ${result.deletedCount} expired URLs`)
  }

  private generateShortUrl(): string {
    const validChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let shortUrl = ''
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length)
      shortUrl += validChars[randomIndex]
    }
    return shortUrl
  }
}
