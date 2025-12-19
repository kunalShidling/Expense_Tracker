import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    // Create index for expenses
    const expensesCollection = db.collection("expenses");
    await expensesCollection.createIndex(
      { userId: 1, date: -1 },
      { name: "userId-date-index" }
    );
    console.log("✓ Expenses index created");

    // Create index for categories with createdAt for sorting
    const categoriesCollection = db.collection("categories");
    await categoriesCollection.createIndex(
      { userId: 1, createdAt: -1 },
      { name: "userId-createdAt-index" }
    );
    await categoriesCollection.createIndex(
      { userId: 1, name: 1 },
      { name: "userId-name-unique-index", unique: true }
    );
    console.log("✓ Categories indexes created");

    // Create index for users
    const usersCollection = db.collection("users");
    await usersCollection.createIndex(
      { email: 1 },
      { name: "email-index", unique: true }
    );
    console.log("✓ Users index created");

    console.log("\n✅ All indexes created successfully!");
    
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating indexes:", error);
    process.exit(1);
  }
}

createIndexes();
