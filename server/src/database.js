const initDatabase = (mongoDb, callback) => {
  const collection = mongoDb.collection('pullRequests');
  collection.ensureIndex({ number: 1 }, { unique: true }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

export default initDatabase;
