const mongoose = require('mongoose');

const LOCAL_DB = 'mongodb://localhost:27017/biterush';
const ATLAS_DB = 'mongodb+srv://itxahsan845_db_user:Khan6023@cluster0.n1xsgdn.mongodb.net/rental_db?appName=Cluster0';

async function copy() {
  try {
    console.log('📦 Connecting to local database...');
    const localConn = await mongoose.createConnection(LOCAL_DB).asPromise();
    
    console.log('☁️ Connecting to Atlas...');
    const atlasConn = await mongoose.createConnection(ATLAS_DB).asPromise();
    
    // Copy menu items
    const items = await localConn.db.collection('menuitems').find().toArray();
    console.log(`Found ${items.length} items in local`);
    
    await atlasConn.db.collection('menuitems').deleteMany({});
    await atlasConn.db.collection('menuitems').insertMany(items);
    console.log(`✅ Copied ${items.length} menu items to Atlas!`);
    
    // Copy admin
    const admins = await localConn.db.collection('admins').find().toArray();
    console.log(`Found ${admins.length} admin in local`);
    
    await atlasConn.db.collection('admins').deleteMany({});
    await atlasConn.db.collection('admins').insertMany(admins);
    console.log(`✅ Copied ${admins.length} admin to Atlas!`);
    
    console.log('\n🎉 SUCCESS! Your data is now in the cloud!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit();
  }
}

copy();