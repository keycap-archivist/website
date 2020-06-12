const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {
  const out = [];
  out.push('**Website is up to date**');
  const rev = fs.readFileSync(path.join(__dirname, '..', 'catalog-revision.txt'), 'utf-8');
  out.push(`- Database revision: ${rev}`);
  await axios.post(process.env.DISCORD_HOOK, {
    content: out.join('\n'),
  });
}

main();
