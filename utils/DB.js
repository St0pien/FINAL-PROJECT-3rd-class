const MongoClient = require('mongodb').MongoClient;
const { url, dbName } = require('../utils/data');


let db = null;
const client = new MongoClient(url, { useUnifiedTopology: true });

class DB {
    static init() {
        return new Promise(resolve => {
            client.connect((err) => {
                if (err) throw err;

                db = client.db(dbName);
                console.log(`Connected to DB ${url}`);
                resolve();
            });
        })
    }

    static addUser(user) {
        return new Promise(resolve => {
            const collection = db.collection('users');
            collection.find({ login: user.login }).toArray((err, result) => {
                if (result.length > 0) {
                    return resolve(false);
                }

                collection.insertOne(user, (err) => {
                    if (err) throw err;

                    resolve(true);
                });
            });
        });
    }

    static authenticateUser(login, hash) {
        return new Promise(resolve => {
            const collection = db.collection('users');
            collection.findOne({ login, password: hash }, (err, result) => {
                if (result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    static addWin(user) {
        const collection = db.collection('users');
        collection.update({ login: user }, { $inc: { wins: 1 } });
    }

    static addDefeat(user) {
        const collection = db.collection('users');
        collection.update({ login: user }, { $inc: { defeats: 1 } });
    }

    static getUserStats(user) {
        return new Promise(resolve => {
            const collection = db.collection('users');
            collection.findOne({ login: user }, (err, result) => {
                if (!result) return resolve({});
                const { wins, defeats } = result;
                resolve({ user, wins, defeats });
            });
        })
    }
}

module.exports = DB;