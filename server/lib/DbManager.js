const Sql = require("../db/Sql");

class DbManager extends Sql {
  // for reference
  // https://knexjs.org

  async getWhitelisted(step) {
    return (await this.sql()).select("*").from("whitelist" + step);
  }

  async newWhitelisted(step, wallet, discord_id) {
    const sql = await this.sql();
    const exist = (
      await sql
        .select("*")
        .from("whitelist" + step)
        .where({
          wallet,
        })
        .orWhere({ discord_id })
    )[0];
    if (exist) {
      return false;
    }
    return sql
      .insert({
        wallet,
        discord_id,
      })
      .returning("*")
      .into("whitelist" + step);
  }

  async updateWhitelist(step, id, receipt) {
    const sql = await this.sql();
    await sql("whitelist" + step)
      .where({
        id,
      })
      .update({
        receipt,
      });
  }
}

let dbManager;
if (!dbManager) {
  dbManager = new DbManager();
}
module.exports = dbManager;
