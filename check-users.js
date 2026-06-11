const { MongoClient } = require('mongodb');
(async () => {
  try {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const users = await client.db('cms_db').collection('users').find({ username: { $in: ['admin','mentor','student'] } }).project({ username:1,email:1,password:1,role:1,active:1 }).toArray();
    console.log(JSON.stringify(users, null, 2));
    await client.close();
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
})();
