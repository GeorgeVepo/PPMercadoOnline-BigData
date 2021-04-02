var __dirname = "";
var puppeteer = require('puppeteer');
var util = require('../Util/util.js');
var pagina = 1;
var busca = "Supermercado";
var page = {};
var browser = {};
var listaReclamacoes = [];
var pageReclamacao = {};
var _site = "";
var urlPesquisa = "";

//module exports para oder usar em outras partes
module.exports = {
    ExecutarMonitoramento: async function (site, dirname, cargaInicial) {
        __dirname = dirname;
        _site = site;
        
        browser = await puppeteer.launch({
            headless: true
        });  
    
        page = await browser.newPage();
    
        try {    

            acessarSite(page, urlPesquisa, ".complain-list > li");
    
            if(cargaInicial){
                cargaInicialObterReclamacao();
    
            } else{
                obterTextoReclamacoes();
            }                    
             
        } catch (e) {
            today = util.getDate();
            fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + e.message + "\r\n", function (err) {});
        
            page.close();
            return "raspagem indisponivel";
        }
    
        page.close();
        browser.close();
    
        return listaReclamacoes;   

    }
}




async function cargaInicialObterReclamacao() {
    var urlPesquisa = "";
    var urlAtual = page.url();
    var re = /pagina=(\d+)/g;
    var myArray = urlAtual.match(re);

    while (myArray[1] == pagina){
        myArray = urlAtual.match(re);
        
        obterTextoReclamacoes();
        pagina++
        acessarSite(page, urlPesquisa, ".complain-list > li")
    }
}      

async function obterTextoReclamacoes() {      
    var urlReclamcao = "";
    var elementTitulo = {};
    var elementConteudo = {};
    var titulo = "";
    var conteudo = "";
    var reclamacao = {};
    pageReclamacao = {};

    listaReclamacoes = await page.$$('.complain-list > li');
        

    for (var i = 0; i < listaReclamacoes.length; i++) {
        urlReclamcao = await listaReclamacoes[i].$eval('a', el => el.href);

        acessarSite(pageReclamacao, urlReclamcao, '.complain-head > .row > .col-md-10 .col-sm-12 > h1');

        try{
        
                titulo = "";
                elementTitulo = await pageReclamacao.$('.complain-head > .row > .col-md-10 .col-sm-12 > h1');
                titulo = await pageReclamacao.evaluate(el => el.textContent, elementTitulo);

                conteudo = "";
                elementConteudo = await pageReclamacao.$('.complain-body > p');
                conteudo = await pageReclamacao.evaluate(el => el.textContent, elementConteudo);

                reclamacao.titulo = titulo;
                reclamacao.conteudo = conteudo;
                listaReclamacoes.push(reclamacao);
                pageReclamacao.close();

        } catch (e) {
                today = util.getDate();
                fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + "erro no método obterTextoReclamacoes. URL: " + urlReclamcao + "\r\n" + e.message + "\r\n", function (err) {});
    
                pageReclamacao.close();
                page.close();
                return "raspagem indisponivel";
        }
    }   
    


}

async function acessarSite(page, url, selector) {   
    try{ 
            ageReclamacao= await browser.newPage();
            urlPesquisa = _site.format(busca, pagina);

            await util.sleep(Math.floor(Math.random() * 3000) + 1000);
    
            await util.tryConnection(page, url, selector, 3);

    } catch (e) {
            today = util.getDate();
            fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + "erro no método acessarSite. URL: " + urlPesquisa + "\r\n" + e.message + "\r\n", function (err) {});

            pageReclamacao.close();
            page.close();
            return "raspagem indisponivel";
    }
}