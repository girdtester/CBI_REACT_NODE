const Pool = require("pg").Pool;
const connection = new Pool({
user: "postgres",
  host: "localhost", 
database: "cbiportal",  
  password: "Renu@1477",  
  port:5432,
});

connection.connect(function(err) {
  if (err) {
   //console.error("Error connecting to the database: " + err.stack);
    return;
  }
  //console.log("Connected to the database as id " + connection.threadId);
});

module.exports = connection;
