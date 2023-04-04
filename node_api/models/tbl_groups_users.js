const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const tbl_groups_users = sequelize.define('tbl_groups_users', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  group_id: {
    type: Sequelize.INTEGER,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'tbl_groups_users'
});

module.exports = tbl_groups_users;