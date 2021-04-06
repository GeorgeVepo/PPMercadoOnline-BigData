const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("PPMercadoOnline"))
            .catch(err => console.log(err))

function findAll() {
        return global.conn.collection("reclamacoes").find().toArray();
}
            
function insertMany(reclamacoes) {
    return global.conn.collection("reclamacoes").insertMany(reclamacoes);
}

module.exports = { findAll, insertMany }