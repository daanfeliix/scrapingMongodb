import { MongoClient } from 'mongodb'

export default class Connect {
    
    url = process.env.MONGODB_URL;
    dbName = process.env.MONGODB_DBNAME;
    collectionName = process.env.MONGODB_COLLECTION;
    collection;

    constructor(){}

    async _main() {
        this.client = await MongoClient.connect(this.url);
        console.info('Connected successfully to server');
        const db = this.client.db(this.dbName);
        this.collection = db.collection(this.collectionName);
    }

    async insert(data) {
        await this._main();
        await this.collection.insertOne(data);
        console.info('Inserted Successfully');
    }


    async update(data) {
        await this._main();
        this.collection.updateOne({_id:data._id},{$set:data})
        console.info('Updated Successfully');
    }

}