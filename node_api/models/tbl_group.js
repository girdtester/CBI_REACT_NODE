const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const tbl_group = sequelize.define('tbl_group', {
  name: {
    type: Sequelize.STRING
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
  tableName: 'tbl_group'
});

module.exports = tbl_group;
