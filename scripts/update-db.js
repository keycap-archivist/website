const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  const dbStr = (
    await axios.get(
      'https://github.com/keycap-archivist/database/raw/master/db/catalog.json',
      { transformResponse: [] },
    )
  ).data;
  await fs.writeFile(
    path.join(__dirname, '..', 'src', 'db', 'catalog.json'),
    dbStr,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
