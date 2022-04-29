/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('forecasts', table => {
    table.increments('id');
    table.smallint('order').unique();
    table.string('title', 50);
    table.text('description');
    table.timestamps(true);
  });
  console.log('[forecasts] table is created');

  await knex.schema.createTable('runes', table => {
    table.increments('id');
    table.smallint('order').unique();
    table.string('title', 50);
    table.boolean('has_inverted');
    table.string('img_direct');
    table.string('img_inverted');
    table.timestamps(true);
  });
  console.log('[runes] table is created');

  await knex.schema.createTable('runetranslations', table => {
    table.increments('id');
    table.string('locale', 10);
    table.string('title', 50);
    table.text('description');
    table.text('forecast_meaning_direct');
    table.text('forecast_meaning_inverted');
    table.integer('rune_id').unsigned().references('runes.id');
    table.timestamps(true);
  });
  console.log('[runetranslations] table is created');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  console.log('Dropping [forecasts] table');
  await knex.schema.dropTable('forecasts');

  console.log('Dropping [runetranslations] table');
  await knex.schema.dropTable('runetranslations');

  console.log('Dropping [runes] table');
  await knex.schema.dropTable('runes');


};
