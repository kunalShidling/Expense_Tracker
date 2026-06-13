import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      // Force IPv4 to avoid ::1 connection refusal on some Windows/MySQL setups.
      host: '127.0.0.1',
      user: 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS expense_tracker;');
    console.log('Database "expense_tracker" created successfully!');
    
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

createDb();
