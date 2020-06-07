import { MongoClient, Collection, Db, InsertOneWriteOpResult, InsertWriteOpResult, CollectionInsertManyOptions, DeleteWriteOpResultObject, CommonOptions, FilterQuery } from "mongodb";

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

    export async function deleteOne(collection: string, filterQuery: FilterQuery<any>, options?: CommonOptions) {
        const resolved = await getOrCreateCollection(collection);
        return new Promise<DeleteWriteOpResultObject>((resolve, reject) => {
            resolved.deleteOne(filterQuery, options || {}, (error, result) => {
                error ? reject(error) : resolve(result);
            });
        }); 
    }

    export async function deleteMany(collection: string, filterQuery: FilterQuery<any>, options?: CommonOptions) {
        const resolved = await getOrCreateCollection(collection);
        return new Promise<DeleteWriteOpResultObject>((resolve, reject) => {
            resolved.deleteMany(filterQuery, options || {}, (error, result) => {
                error ? reject(error) : resolve(result);
            });
        }); 
    }

    export async function listCollections() {
        return (await database.collections()).map(col => col.namespace.split(".")[1]);
    }

    export async function clearCollections(...collections: string[]) {
        const existing = await listCollections();
        const resolved = collections.filter(requested => existing.includes(requested));
        return Promise.all(resolved.map(collection => database.dropCollection(collection)));
    }

}