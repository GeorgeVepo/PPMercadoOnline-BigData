var Client = require('node-rest-client').Client;
var client = new Client();


module.exports = {
    ObterURLUberEats: function () {
        return "https://www.reclameaqui.com.br/empresa/uber-eats/lista-reclamacoes/?busca={0}&pagina={1}";
    },
    ObterURLIFood: function () {
        return "https://www.reclameaqui.com.br/empresa/ifood/lista-reclamacoes/?busca={0}&pagina={1}";
    },
    ObterURLJamesDelivery: function () {
        return "https://www.reclameaqui.com.br/empresa/james-delivery/lista-reclamacoes/?busca={0}&pagina={1}";
    },
    ObterURLRappi: function () {
        return "https://www.reclameaqui.com.br/empresa/james-delivery/lista-reclamacoes/?busca={0}&pagina={1}";
    },
    ObterProdutos: async function (id_site, URLBase, callback) {
        // direct way
        client.get(URLBase + "/ObterProdutosParaPesquisa?id_site=" + id_site, function (produtos, response) {
            callback(produtos);
        });

    },
    ObterSites: async function (URLBase, callback, processo) {
        // direct way
        client.get(URLBase + "/ObterSitesAtivos", function (sites, response) {
            return callback(sites, processo);
        });
    },
    EnviarOfertas: async function (URLBase, ofertas) {
        // direct way

        var args = {
            data: ofertas,
            headers: {
                "Content-Type": "application/json"
            }
        };

        client.post(URLBase + "/EnviarOfertas", args, function (response) {

        });

    },
    AnalisarOfertas: async function (URLBase) {
        // direct way

        var args = {            
            headers: {
                "Content-Type": "application/json"
            }
        };

        client.post(URLBase + "/AnalisarOfertas", args, function (response) {

        });

    }
}
