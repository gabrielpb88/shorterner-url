import { type Collection } from 'mongodb'
import { UrlService } from './url.service'
import { type Url } from '../interfaces/url.interface'

// remove logs from tests
jest.mock('logger')

describe('getOriginalUrl', () => {
  let collectionMock: jest.Mocked<Collection<Url>>
  let service: UrlService

  beforeAll(() => {
    collectionMock = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      deleteMany: jest.fn(),
    } as unknown as jest.Mocked<Collection<Url>>
    service = new UrlService(collectionMock)
    process.env.EXPIRATION_TIME = '1'
  })

  describe('getOriginalUrl', () => {
    it('should return the original URL when shortUrl is found', async () => {
      const mockShortUrl = 'any-url'
      const mockOriginalUrl = 'https://example.com'
      collectionMock.findOne.mockResolvedValue({
        shortUrl: mockShortUrl,
        original: mockOriginalUrl,
      } as unknown as Url)

      const result = await service.getOriginalUrl(mockShortUrl)

      expect(collectionMock.findOne).toHaveBeenCalledWith({
        shortUrl: mockShortUrl,
      })
      expect(result).toBe(mockOriginalUrl)
    })

    it('should return null when shortUrl is not found', async () => {
      const mockShortUrl = 'not-found-short-url'
      collectionMock.findOne.mockResolvedValue(null)

      const result = await service.getOriginalUrl(mockShortUrl)

      expect(collectionMock.findOne).toHaveBeenCalledWith({
        shortUrl: mockShortUrl,
      })
      expect(result).toBeUndefined()
    })

    it('should throw an error if collection.findOne fails', async () => {
      const mockShortUrl = 'any short url'
      const error = new Error('Database failure')
      collectionMock.findOne.mockRejectedValue(error)

      await expect(service.getOriginalUrl(mockShortUrl)).rejects.toThrow(
        'Database failure'
      )
    })
  })

  describe('shortenUrl', () => {
    it('should insert a new URL and return the generated shortUrl', async () => {
      jest.spyOn(service as any, 'generateShortUrl').mockReturnValue('hash')

      const originalUrl = 'http://www.any-url.com'
      const result = await service.shortenUrl(originalUrl)

      expect(collectionMock.insertOne).toHaveBeenCalledWith({
        original: originalUrl,
        shortUrl: 'hash',
        createdAt: expect.any(Date),
        expiresAt: expect.any(Date),
      })
      expect(result).toBe('hash')
    })
  })

  describe('deleteExpiredUrls', () => {
    it('should delete all expired URLs', async () => {
      const fakeNow = new Date('2025-01-01T00:00:00Z')
      jest.spyOn(global.Date, 'now').mockImplementation(() => fakeNow.getTime())

      collectionMock.deleteMany.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      })
      await service.deleteExpiredUrls()
      expect(collectionMock.deleteMany).toHaveBeenCalledWith({
        expiresAt: { $lt: fakeNow },
      })

      jest.spyOn(global.Date, 'now').mockRestore()
    })
  })
})
