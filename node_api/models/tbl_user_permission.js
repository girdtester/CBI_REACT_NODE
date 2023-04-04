const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const tbl_user_permission = sequelize.define('tbl_user_permission', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  permission_id: {
    type: Sequelize.INTEGER,
  },
  sub_permission_id: {
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
  timestamps: false,
  tableName: 'tbl_user_permission'
});

module.exports = tbl_user_permission;