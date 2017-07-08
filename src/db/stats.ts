import Database from '../db';

export default class StatsDB extends Database {
  constructor() {
    super()
  }

  private async getSubStat<T>(table: string, queryBy: T) {
    return await this.db.table(table).where(queryBy)
  }

  private async uniqueInsert<T>(table: string, data: T, returnid?: string): Promise<number> {
    let doesExist = await this.db
      .table(table)
      .select('*')
      .where(data)

    // console.log('does exist:', (doesExist.length === 0), doesExist[0][returnid])

    // Does not exist, create new entry
    if (doesExist.length === 0) {
      return await this.db
        .table(table)
        .insert(data)
        .returning(returnid)
    }
    else {
      // Just return the id of the existing matching entry
      return doesExist[0][returnid]
    }
  }

  private async updateStatData(insert: ESS.StatsInsert, insertNew?: boolean) {
    // Add _app data
    let app_id = await this.uniqueInsert('stats_app', insert.stats.app, 'releaseid')
    // Add _cpus data
    let cpu_id = await this.uniqueInsert('stats_cpus', insert.stats.cpu, 'cpuid')
    // Add _os data
    let os_id = await this.uniqueInsert('stats_os', insert.stats.os, 'osid')

    // console.log(`
    //   app_id: ${app_id}
    //   cpu_id: ${cpu_id}
    //   os_id: ${os_id}
    // `)

    if (insertNew === true) {
      // Associate all stats_*
      await this.db.table(`stats_breakdown`).insert({
        from: insert.id,
        app: app_id,
        cpu: cpu_id,
        os: os_id
      })
    }
    else {
      // Update stat_breakdown for id
      // Associate all stats_*
      await this.db
        .table(`stats_breakdown`)
        .update({
          app: app_id,
          cpu: cpu_id,
          os: os_id
        })
        .where({ from: insert.id })
        .toQuery()

      await this.incrementUpdates(insert.id)
    }
  }

  public async updateStatHash(newSum: string, id: number) {
    return await this.db.table(`stats`)
      .update({
        checksum: newSum
      })
      .where({ id: id })
  }

  public async setStats(insert: ESS.StatsInsert) {
    // Create basic stat entry unique to machine uuid
    let id = await this.db.table(`stats`).insert({
      appid: insert.appid,
      uuid: insert.uuid,
      submitted: this.db.fn.now(),
      updated: this.db.fn.now(),
      checksum: insert.checksum
    })

    let insertUpdated = insert
    insert.id = id

    await this.updateStatData(insertUpdated, true)
  }

  public async incrementCheckIns(id: number) {
    return await this.db
      .table(`stats`)
      .where({ id: id })
      .increment('checkins', 1)
  }

  public async incrementUpdates(id: number) {
    return await this.db
      .table(`stats`)
      .where({ id: id })
      .increment('updates', 1)
      .update({ updated: this.db.fn.now() })
  }

  public async getStat(query: { id?: number, uuid?: string, appid?: number }): Promise<Array<ESS.StatsInsert>> {
    return await this.db
      .select('*')
      .from(`stats`)
      .where(query)
  }

  public async addJob(job: ESS.QueueJob) {
    return await this.db
      .table(`stats_queue`)
      .insert({
        statid: job.statid,
        raw: JSON.stringify(job.raw),
        type: 'stat-update',
        params: JSON.stringify(job.params)
      })
  }

  public async removeQueueItem(id: number) {
    console.log(`JobQueue->Removing id: ${id}`)
    await this.db
      .table(`stats_queue`)
      .where({ jobid: id })
      .del()
  }

  public async getQueueItems(limit?: number): Promise<Array<ESS.QueueJob>> {
    return await this.db
      .select('*')
      .from(`stats_queue`)
      .limit((limit !== undefined) ? limit : 10)
  }

  public async processQueueItems() {
    console.log(`JobQueue->Checking for Jobs in queue..`)
    let queueItems = await this.getQueueItems(parseInt(process.env.JOBQUEUE_AMOUNT))

    // If none, exit
    if (queueItems.length === 0) { return queueItems.length }

    // Else, start processing
    for (var index = 0; index < queueItems.length; index++) {
      var stat = queueItems[index];
      console.log(`JobQueue->Processing id: ${stat.jobid}`)
      let raw = <ElectronStats.Stats>JSON.parse(stat.raw)

      await this.updateStatData({
        id: stat.statid,
        stats: raw
      }).then(() => this.removeQueueItem(stat.jobid))
    }

    return `processed: ${queueItems.length}`
  }

  public async getStats(): Promise<ESS.CLIResponse> {
    let uniqueApplications = await this.db.table(`applications`).count('appid as count')
    let uniqueSubmissions = await this.db.table(`stats`).count('id as count')
    let uniqueReleases = await this.db.table(`stats_app`).count('releaseid as count')
    let uniqueCpus = await this.db.table(`stats_cpus`).count('cpuid as count')
    let statsQueued = await this.db.table(`stats_queue`).count('jobid as count')

    return {
      message: `
      Applications:  ${uniqueApplications[0].count}

      Submissions:   ${uniqueSubmissions[0].count}
      Releases:      ${uniqueReleases[0].count}
      CPUs:          ${uniqueCpus[0].count}

      Stats Queue:   ${statsQueued[0].count}
    `
    }
  }
}