/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('answers', table => {
    table.increments('id');
    table.string('question');
    table.string('ip', 50);
    table.string('origin', 100);
    table.json('answer');
    table.timestamps(true);
  });
  console.log('[answers] table is created');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  console.log('Dropping [answers] table');
  await knex.schema.dropTable('answers');
  console.log('Table [answers] is deleted');
};
