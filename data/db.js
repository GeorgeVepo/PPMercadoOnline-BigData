const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("ReclamacoesDB"))
            .catch(err => console.log(err))

function findAll() {
        return global.conn.collection("reclamacoes").find().toArray();
}
            
function insertMany(reclamacoes) {
    return global.conn.collection("reclamacoes").insertMany(reclamacoes);
}


function deleteAll() {
    return global.conn.collection("reclamacoes").deleteMany( { } );;
}

module.exports = { findAll, insertMany, deleteAll }