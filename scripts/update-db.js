const { getDistantRev, updateDb } = require('./utils');

async function main() {
  const revision = await getDistantRev();
  await updateDb(revision);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
