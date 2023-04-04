const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  },
  password: {
      type: Sequelize.STRING,
  },
  role: {
      type: Sequelize.INTEGER,
  },
   is_active: {
      type: Sequelize.INTEGER,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = User;
