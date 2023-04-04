const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatgpt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const tbl_files = sequelize.define('tbl_files', {
  file_name: {
    type: Sequelize.STRING,
  },
  changed_name: {
    type: Sequelize.STRING,
  },
   title: {
    type: Sequelize.STRING,
  },
   description: {
    type: Sequelize.STRING,
  },
  is_deleted: {
    type: Sequelize.INTEGER,
  },
    is_active: {
    type: Sequelize.INTEGER,
  },
  user_id: {
    type: Sequelize.INTEGER,
  },
   created_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = tbl_files;
