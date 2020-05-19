const { checkNeedUpdate } = require('./utils');

checkNeedUpdate()
  .then((status) => {
    if (status) {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((e) => {
    console.log('Unexpected error occured');
    console.error(e);
    process.exit(1);
  });
