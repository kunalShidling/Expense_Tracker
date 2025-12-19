import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    console.log("🔍 Testing MongoDB connection...");
    console.log(`📍 Connecting to: ${process.env.MONGODB_URL}`);
    
    await mongoose.connect(process.env.MONGODB_URL);
    
    console.log("✅ Successfully connected to MongoDB!");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    await mongoose.connection.close();
    console.log("👋 Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
