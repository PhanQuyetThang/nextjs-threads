const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    database: 'testdb'

});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');

}
);

module.exports = connection;
