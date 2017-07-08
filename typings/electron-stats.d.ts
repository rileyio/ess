declare namespace ElectronStats {
  class ElectronStats extends NodeJS.EventEmitter {
    /**
     * Uniquie UUID for single machine v5(UUID)
     * using electron-stats:uuid::<v5 UUID>
     * 
     * @type {string}
     * @memberof Stats
     */
    uuid: string
    /**
     * Creates an instance of ElectronStats.
     * @param {ElectronStats.Options} options 
     * 
     * @memberof ElectronStats
     */
    constructor(options: ElectronStats.Options)
    /**
     * Creates an instance of ElectronStats.
     * @param {ElectronStats.Options} options 
     * @param {Electron.App} [app] 
     * 
     * @memberof ElectronStats
     */
    constructor(options: ElectronStats.Options)
    /**
     * Trigger for sending stats to defined electron-stats-server
     * 
     * @memberof ElectronStats
     */
    send(): void
  }


  /**
   * Options (some overrides) for ElectronStats collection & sending
   * 
   * @interface Options
   */
  interface Options {
    /**
     * Authentication key from ESS Server
     * 
     * @type {string}
     * @memberof Options
     */
    authentication: string
    /**
     * Application UUID generated on ESS Server
     * 
     * @type {string}
     * @memberof Options
     */
    application_id: string
    /**
     * Remote host to send to
     * 
     * @type {string}
     * @memberof Options
     */
    host: string
    /**
     * Remote host's port to connect on
     * 
     * @type {number}
     * @memberof Options
     */
    port: number,
    /**
     * (Optional) Override for auto sending data once collected
     * 
     * @type {boolean}
     * @memberof Options
     */
    autoSend?: boolean
    /**
     * (Optional) Override for auto collecting when ElectronStats is constructed
     * 
     * @type {boolean}
     * @memberof Options
     */
    autoCollect?: boolean
  }

  interface Stats {
    app: StatsApp
    cpu: StatsCPU
    os: StatsOS
  }

  interface StatsApp {
    /**
     * When application is complied will contain
     * the app's package.json version
     * 
     * @type {string}
     * @memberof StatsApp
     */
    version: string
    /**
     * Version of Electron base
     * 
     * @type {string}
     * @memberof StatsApp
     */
    electron: string
    /**
     * Architecture (example: x64)
     * 
     * @type {string}
     * @memberof StatsApp
     */
    arch: string
  }

  /**
   * Some basic information about the system's CPU for
   *  statistical purposes
   * 
   * @interface StatsCPU
   */
  interface StatsCPU {
    /**
     * Basic # of cores
     * 
     * @type {number}
     * @memberof StatsCPU
     */
    cores: number
    /**
     * CPU Model string taken from first core (when multiCore), 
     * Example: Intel(R) Core(TM) i7-4770K CPU @ 3.50GHz
     * 
     * @type {string}
     * @memberof StatsCPU
     */
    model: string
    /**
     * CPU Model speed taken from first core (when multiCore)
     * 
     * @type {number}
     * @memberof StatsCPU
     */
    speed: number
  }

  interface StatsOS {
    release: string
    platform: string
    memory: number
  }
}

declare module 'ElectronStats' {
  export = ElectronStats
}