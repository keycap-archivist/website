const path = require('path');
const axios = require('axios');
const fs = require('fs').promises;

const revFile = path.join(__dirname, '..', 'catalog-revision.txt');
const catalogFile = path.join(__dirname, '..', 'src', 'db', 'catalog.json');
const apiCatalogRev =
  'https://api.github.com/repos/keycap-archivist/database/commits?path=db/catalog.json';

async function getDistantRev() {
  return (await axios.get(apiCatalogRev)).data[0].sha;
}

async function checkNeedUpdate() {
  const currentRev = await (await fs.readFile(revFile, 'utf-8')).trim();
  const distantRev = await getDistantRev();
  console.log(`currentRev: ${currentRev}`);
  console.log(`distantRev: ${distantRev}`);
  if (currentRev !== distantRev) {
    console.log('Need to update DB');
    return true;
  }
  console.log('No need to update');
  return false;
}

async function updateDb(revision) {
  const rawFile = (
    await axios.get(
      `https://raw.githubusercontent.com/keycap-archivist/database/${revision}/db/catalog.json`,
      { transformResponse: [] },
    )
  ).data;
  await fs.writeFile(catalogFile, rawFile);
  await fs.writeFile(revFile, revision);
}

module.exports = {
  checkNeedUpdate,
  getDistantRev,
  updateDb,
  revFile,
};
