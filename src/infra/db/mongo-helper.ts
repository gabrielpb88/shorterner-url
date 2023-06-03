import { type Collection, MongoClient } from 'mongodb'

export abstract class MongoHelper {
  private static client: MongoClient
  private static url: string

  static async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }

  static map (document: any): any {
    const { _id, ...documentWithoutId } = document
    return documentWithoutId
  }

  static async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  }
}
