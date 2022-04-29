require('dotenv').config({path: '../.env'});
const fs = require('fs');
const {parse} = require('csv-parse/sync');

const db = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.RUNES_DB_HOST,
    database: process.env.RUNES_DB_NAME,
    user:     process.env.RUNES_DB_USER,
    password: process.env.RUNES_DB_PASSWORD
  }
});

const DIVINATIONS_FILENAME = 'data injection/divinations.csv';
const RUNES_FILENAME = 'data injection/runes.csv';
const RUNETRANSLATIONS_FILENAME = 'data injection/runetranslations.csv';

(async () => {
// ------------- INSERT FORECASTS -------------------
  const divinationsContent = fs.readFileSync(DIVINATIONS_FILENAME, 'utf8');

  const records = parse(divinationsContent, {
    delimiter: ',',
    columns: true
  });

  await db('forecasts').insert(records);
  console.log('Forecasts inserted');

// --------- INSERT RUNES -----------------
  const runesCSV = fs.readFileSync(RUNES_FILENAME, 'utf8');
  const runesRecords = parse(runesCSV, {
    delimiter: ',',
    columns: true
  });

  await db('runes').insert(runesRecords);
  console.log('Runes inserted');

// --------- INSERT RUNE TRANSLATIONS -----------------
  const runetranslationsCSV = fs.readFileSync(RUNETRANSLATIONS_FILENAME, 'utf8');
  const runetranslationsRecords = parse(runetranslationsCSV, {
    delimiter: ',',
    columns: true
  });

  try {
    await db('runetranslations').insert(runetranslationsRecords);
    console.log('Rune translations inserted');
  } catch (err) {
    console.log(err);
  }

  await db.destroy();
}
)();

