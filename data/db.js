const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("PPMercadoOnline"))
            .catch(err => console.log(err))

function findAll() {
        return global.conn.collection("reclamacoes").find().toArray();
}
            
function insertAll(reclamacoes) {
    return global.conn.collection("reclamacoes").insertAll(reclamacoes);
}

module.exports = { findAll, insertAll }