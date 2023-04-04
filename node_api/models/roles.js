const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const tbl_role_type = sequelize.define('tbl_role_type', {
  role_name: {
    type: Sequelize.STRING
  },
}, {
  timestamps: false,
  tableName: 'tbl_role_type'
});

module.exports = tbl_role_type;
