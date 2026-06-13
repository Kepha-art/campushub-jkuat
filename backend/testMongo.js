const mongoose = require('mongoose');
const hosts = [
  'ac-qijkdtb-shard-00-00.ve2tjrd.mongodb.net',
  'ac-qijkdtb-shard-00-01.ve2tjrd.mongodb.net',
  'ac-qijkdtb-shard-00-02.ve2tjrd.mongodb.net',
];

(async () => {
  for (const host of hosts) {
    process.stdout.write(`Testing ${host}... `);
    const uri = `mongodb://campushub_admin:Rozala1@${host}:27017/admin?tls=true&directConnection=true&authSource=admin&retryWrites=true&w=majority`;
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log('OK');
      await mongoose.disconnect();
    } catch (err) {
      console.log('FAILED');
      console.error(err.message);
    }
  }
})();