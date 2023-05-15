const mysql = require("mysql2");

const connect = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Beans",
    database: "employees_db",
});

connect.connect((err) => {
    if (err) throw err;
    console.log("Successfully connected to employees_db!");

});

module.exports = connect;