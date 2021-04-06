var __dirname = "";
var fs = require("fs");
var _puppeteer = require('puppeteer');
var _util = require('../util/util.js');
var _pagina = 1;
var _today = "";
var _busca = "Supermercado";
var _page = {};
var _browser = {};
var _listaReclamacoes = [];
var _pageReclamacao = {};
var _site = "";

//module exports para oder usar em outras partes
module.exports = {
    ExecutarMonitoramento: async function (site, dirname, cargaInicial) {
        
        fs.appendFile(__dirname + '//Log.txt', "ExecutarMonitoramento", function (err) {});
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
            _today = _util.getDate();
            fs.appendFile(__dirname + '//Log.txt', "\r\n" + _today + "\r\n" + e.message + "\r\n", function (err) {});
            return "raspagem indisponivel";
        }
    
        _page.close();
        _browser.close();
    
        return _listaReclamacoes;   

    }
}




async function cargaInicialObterReclamacao() {
    
    fs.appendFile(__dirname + '//Log.txt', "cargaInicialObterReclamacao", function (err) {});
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
    var urlReclamacao = "";
    var elementTitulo = {};
    var elementConteudo = {};
    var titulo = "";
    var conteudo = "";
    var reclamacao = {};
    _pageReclamacao = {};

    _listaReclamacoes = await _page.$$('.complain-list > li');        

    for (var i = 0; i < _listaReclamacoes.length; i++) {
        _pageReclamacao = await _browser.newPage();  
        urlReclamacao = await _listaReclamacoes[i].$eval('a', el => el.href);

        acessarSite(_pageReclamacao, urlReclamacao, '.complain-head > .row > .col-md-10 .col-sm-12 > h1');

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
                _today = _util.getDate();
                fs.appendFile(__dirname + '//Log.txt', "\r\n" + _today + "\r\n" + "erro no método obterTextoReclamacoes. URL: " + urlReclamacao + "\r\n" + e.message + "\r\n", function (err) {});
    
                _pageReclamacao.close();
                return "raspagem indisponivel";
        }
    }   
    


}

async function acessarSite(page, site, selector) {   
    try{ 
        fs.appendFile(__dirname + '//Log.txt', "acessarSite", function (err) {});

            await _util.sleep(Math.floor(Math.random() * 3000) + 1000);
    
            await _util.tryConnection(page, site, selector, 3);

    } catch (e) {
            _today = _util.getDate();
            fs.appendFile(__dirname + '//Log.txt', "\r\n" + _today + "\r\n" + "erro no método acessarSite. URL: " + site + "\r\n" + e.message + "\r\n", function (err) {});

            page.close();
            throw e;
    }
}