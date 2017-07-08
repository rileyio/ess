declare namespace ESS {
  interface StatsInsert {
    id?: number
    appid?: string
    prevStats?: ElectronStats.Stats
    stats: ElectronStats.Stats
    checksum?: string
    uuid?: string
  }

  interface Stat {
    id?: number
    uuid?: string
    appid?: number
    submitted?: string
    updated?: string
    checksum?: string
    checkins?: number
    updates?: number
  }

  interface QueueJob {
    jobid?: number
    statid: number
    raw: string | any
    type?: string
    params?: string | object | any
  }

  interface CLIResponse {
    message: string
    error?: Error | string | any
    [key: string]: any
  }

  interface ClIDotEnvSetupResponse extends CLIResponse {
    env_file: any,
    env_file_overwrite: boolean
  }
}