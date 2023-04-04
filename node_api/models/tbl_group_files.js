const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const tbl_group_files = sequelize.define('tbl_group_files', {
  file_id: {
    type: Sequelize.INTEGER,
  },
  group_id: {
    type: Sequelize.INTEGER,
  },
  main_id: {
    type: Sequelize.INTEGER,
  }
}, {
  timestamps: false
});

module.exports = tbl_group_files;
