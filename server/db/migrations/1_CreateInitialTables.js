class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    // await sql.schema.dropTableIfExists("whitelist1");

    if (!(await sql.schema.hasTable("whitelist1"))) {
      await sql.schema.createTable("whitelist1", (table) => {
        table.increments("id").primary();
        table.string("discord_id").notNullable();
        table.string("wallet").notNullable();
        table.timestamp("created_at").defaultTo(sql.fn.now());
        table.text("receipt");
      });
      done = true;
      console.info('Table "whitelist1" created.');
    }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreateInitialTables;
