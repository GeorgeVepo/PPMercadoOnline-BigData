var __dirname = "";
var _puppeteer = require('puppeteer');
var _util = require('../util/util.js');
var _pagina = 1;
var _busca = "Supermercado";
var _page = {};
var _browser = {};
var _listaReclamacoes = [];
var _pageReclamacao = {};
var _site = "";

//module exports para oder usar em outras partes
module.exports = {
    ExecutarMonitoramento: async function (site, dirname, cargaInicial) {
        __dirname = dirname;
        _site = site;
        
        _browser = await _puppeteer.launch({
            headless: false
        });  
    
        _page = await _browser.newPage();        
    
        try {    

            acessarSite(_page, _site.format(_busca, _pagina), ".complain-list > li");
    
            if(cargaInicial){
                cargaInicialObterReclamacao();
    
            } else{
                obterTextoReclamacoes();
            }                    
             
        } catch (e) {
            today = _util.getDate();
            fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + e.message + "\r\n", function (err) {});
            return "raspagem indisponivel";
        }
    
        _page.close();
        _browser.close();
    
        return _listaReclamacoes;   

    }
}




async function cargaInicialObterReclamacao() {
    var urlAtual = _page.url();
    var re = /pagina=(\d+)/g;
    var myArray = urlAtual.match(re);

    while (myArray[1] == _pagina){
        myArray = urlAtual.match(re);
        
        obterTextoReclamacoes();
        _pagina++
        acessarSite(_page, _site.format(_busca, _pagina),".complain-list > li")
    } 
}      

async function obterTextoReclamacoes() {      
    var urlReclamcao = "";
    var elementTitulo = {};
    var elementConteudo = {};
    var titulo = "";
    var conteudo = "";
    var reclamacao = {};
    _pageReclamacao = {};

    _listaReclamacoes = await _page.$$('.complain-list > li');        

    for (var i = 0; i < _listaReclamacoes.length; i++) {
        _pageReclamacao = await _browser.newPage();  
        urlReclamcao = await _listaReclamacoes[i].$eval('a', el => el.href);

        acessarSite(_pageReclamacao, urlReclamcao, '.complain-head > .row > .col-md-10 .col-sm-12 > h1');

        try{
        
                titulo = "";
                elementTitulo = await _pageReclamacao.$('.complain-head > .row > .col-md-10 .col-sm-12 > h1');
                titulo = await _pageReclamacao.evaluate(el => el.textContent, elementTitulo);

                conteudo = "";
                elementConteudo = await _pageReclamacao.$('.complain-body > p');
                conteudo = await _pageReclamacao.evaluate(el => el.textContent, elementConteudo);

                reclamacao.titulo = titulo;
                reclamacao.conteudo = conteudo;
                _listaReclamacoes.push(reclamacao);
                _pageReclamacao.close();

        } catch (e) {
                today = _util.getDate();
                fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + "erro no método obterTextoReclamacoes. URL: " + urlReclamcao + "\r\n" + e.message + "\r\n", function (err) {});
    
                _pageReclamacao.close();
                return "raspagem indisponivel";
        }
    }   
    


}

async function acessarSite(page, site, selector) {   
    try{ 
            await _util.sleep(Math.floor(Math.random() * 3000) + 1000);
    
            await _util.tryConnection(page, site, selector, 3);

    } catch (e) {
            today = _util.getDate();
            fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + "erro no método acessarSite. URL: " + site + "\r\n" + e.message + "\r\n", function (err) {});

            page.close();
            throw e;
    }
}