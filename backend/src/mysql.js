import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize('expense_tracker', 'root', process.env.MYSQL_PASSWORD || '', {
  // Force IPv4 to avoid ::1 connection refusal on some Windows/MySQL setups.
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');
    await sequelize.sync({ alter: true }); 
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { sequelize };
