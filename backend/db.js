import { MongoClient } from 'mongodb'

const url = `mongodb+srv://sanketnaliyadra:sanket8871935@cluster0.wpietkw.mongodb.net/FA3DB?retryWrites=true&w=majority`;
let db;

const connectToDb = (callback) => {
    MongoClient.connect(url)
        .then(client => {
            db = client.db()
            callback(url);
        }).catch(err => {
            console.log(err);
            callback(null, err);
        })
}

const getDb = () => {
    return db;
}

export {
    connectToDb,
    getDb
}