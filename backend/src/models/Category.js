import { DataTypes } from 'sequelize';
import { sequelize } from '../mysql.js';

const Category = sequelize.define('Category', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'name']
    },
    {
      fields: ['userId', 'createdAt']
    }
  ]
});

export default Category;
