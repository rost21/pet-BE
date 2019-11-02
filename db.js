const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/mydb';

export const db_connect = () => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        console.log('Database created!');
        db.close();
    });
};
