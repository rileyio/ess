import Database from '../db';

export default class ApplicationDB extends Database {
  constructor() {
    super()
  }

  public async add(name: string, uuid: string) {
    await this.db
      .table(`applications`)
      .insert({ name: name, uuid: uuid })
  }

  public async get(nameORuuid: string, multipleLimit?: number) {
    return await this.db
    .table(`applications`)
      .where('name', 'like', `%${nameORuuid}%`)
      .orWhere('uuid', 'like', `%${nameORuuid}%`)
      .limit((multipleLimit !== undefined) ? multipleLimit : 100)
  }

  public async getAll(offset: number, limit: number): Promise<Array<{ appid: number, uuid: string, name: string }>> {
    return await this.db(`applications`)
      .select('*')
      .offset(offset)
      .limit(limit)
  }
}