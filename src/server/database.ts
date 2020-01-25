import { MongoClient, Collection, Db, InsertOneWriteOpResult, InsertWriteOpResult, CollectionInsertManyOptions } from "mongodb";

export namespace Database {

    const database_url = "mongodb://localhost:27017/";
    const connection_options = { useNewUrlParser: true, useUnifiedTopology: true };
    let database: Db;

    export async function connect(target: string) {
        database = await new Promise<Db>((resolve, reject) => {
            MongoClient.connect(database_url, connection_options, (error, client) => error ? reject(error) : resolve(client.db(target)));
        });
    }

    export async function getOrCreateCollection(name: string) {
        return new Promise<Collection<any>>((resolve, reject) => {
            database.collection(name, (error, collection) => {
                if (error) {
                    new Promise<Collection<any>>((resolve, reject) => {
                        database.createCollection(name, (error, collection) => error ? reject(error) : resolve(collection));
                    }).then(resolve).catch(reject);
                } else {
                    resolve(collection);
                }
            });
        });
    }

    export async function insert(collection: string, data: any[] | any, options?: CollectionInsertManyOptions) {
        const resolved = await getOrCreateCollection(collection);
        if (Array.isArray(data)) {
            return new Promise<InsertWriteOpResult<any>>((resolve, reject) => {
                resolved.insertMany(data, options || {}, (error, result) => {
                    error ? reject(error) : resolve(result);
                });
            }); 
        } else {
            return new Promise<InsertOneWriteOpResult<any>>((resolve, reject) => {
                resolved.insertOne(data, (error, result) => {
                    error ? reject(error) : resolve(result);
                });
            });
        }
    }

    export async function clearCollections(...collections: string[]) {
        return Promise.all(collections.map(collection => database.dropCollection(collection)));
    }

}