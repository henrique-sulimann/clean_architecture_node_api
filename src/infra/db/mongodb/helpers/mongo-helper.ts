import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(
      process.env.MONGO_URL ?? 'teste',
      {}
    )
  },
  async disconnect (): Promise<void> {
    this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
