/**
 * Initialize the MongoDb database.
 * @param {object} mongoDb - MongoDb connexion.
 * @param {requestCallback} callback
 */
const initDatabase = (mongoDb, callback) => {
  const collection = mongoDb.collection('pullRequests');
  collection.ensureIndex({ number: 1 }, { unique: true }, (err) => {
    callback(err);
  });
};

export default initDatabase;
