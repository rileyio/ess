module.exports.up = async (db) => {
  // ----------------------------------- //
  //    Applications to track            //
  // ----------------------------------- //
  await db.schema.createTable(`applications`, (table) => {
    table.increments('appid').primary()
    table.string('uuid', 60).notNullable()
    table.string('name', 64).notNullable()
    // Set uniques
    table.unique(['appid', 'uuid'])
  })

  await db.schema.createTable(`auth`, (table) => {
    table.integer('appid').unsigned().references('appid').inTable('applications')
    table.string('key').notNullable()
    table.dateTime('created_at')
    table.dateTime('expires').nullable()
    // Set uniques
    table.unique(['key'])
    table.boolean('enabled').defaultTo(true)
  })

  await db.schema.createTable(`stats`, (table) => {
    table.increments('id')
      .primary()
      .unique()
    table.uuid('uuid', 60).notNullable()
    table.integer('appid')
      .unsigned()
      .references('appid')
      .inTable('applications')
    table.dateTime('submitted').notNullable()
    table.dateTime('updated').notNullable()
    table.string('checksum').notNullable()
    table.integer('checkins').notNullable().defaultTo(0)
    table.integer('updates').notNullable().defaultTo(0)
  })

  await db.schema.createTable(`stats_queue`, (table) => {
    table.increments('jobid')
      .primary()
      .unique()
    table.integer('statid')
      .unsigned()
    table.json('raw')
    table.json('params')
    table.string('type')
  })

  await db.schema.createTable(`stats_app`, (table) => {
    table.increments('releaseid')
      .primary()
      .unique()
    table.string('version')
    table.string('electron')
    table.string('arch')

  })

  await db.schema.createTable(`stats_cpus`, (table) => {
    table.increments('cpuid')
      .primary()
      .unique()
    table.integer('cores')
    table.string('model')
    table.integer('speed')
  })

  await db.schema.createTable(`stats_os`, (table) => {
    table.increments('osid')
      .primary()
      .unique()
    table.string('release')
    table.string('platform')
    table.bigInteger('memory')
  })

  await db.schema.createTable(`stats_breakdown`, (table) => {
    table.integer('from')
      .unsigned()
      .references('id')
      .inTable('stats')
    table.integer('app')
      .unsigned()
      .references('releaseid')
      .inTable('stats_app')
    table.integer('cpu')
      .unsigned()
      .references('cpuid')
      .inTable('stats_cpus')
    table.integer('os')
      .unsigned()
      .references('osid')
      .inTable('stats_os')
  })
}

module.exports.down = async (db) => {
  await db.schema.dropTableIfExists(`applications`)
  await db.schema.dropTableIfExists(`stats`)
  await db.schema.dropTableIfExists(`stats_breakdown`)
  await db.schema.dropTableIfExists(`stats_app`)
  await db.schema.dropTableIfExists(`stats_cpus`)
  await db.schema.dropTableIfExists(`stats_os`)
}
