var _puppeteer = require('puppeteer');
var _util = require('../util/util.js');
var _db = require('../data/db.js');
var _pagina = 1;
var _busca = "Supermercado";
var _page = {};
var _browser = {};
var _listaURLReclamacoes = [];
var _listaReclamacoes = [];
var _pageReclamacao = {};
var _site = "";
String.prototype.format = _util.format;

//module exports para oder usar em outras partes
module.exports = {
    ExecutarMonitoramento: async function (site, dirname, cargaInicial, pagina) {
        __dirname = dirname;
     
        _site = site;
        
        _pagina = pagina;

        _listaReclamacoes = [];


        _browser = await _puppeteer.launch({            
            headless: false
        });      
                
        _page = await _browser.newPage();        
    
        await acessarSite(_page, _site.format(_busca, _pagina), ".complain-list > li > a");
        
        try { 

            if(cargaInicial){
                await cargaInicialObterReclamacao();
    
            } else{
                await obterTextoReclamacoes();
            }                    
             
        } catch (e) {
            _util.gerarLog(e.message);
        }
    
        _page.close();
        _browser.close();

        

        if(_listaReclamacoes.length > 0){  
            var list = [];         

            try{
                await _db.insertMany(_listaReclamacoes);            
            } catch (e){
                _util.gerarLog("Erro ao salvar registros" + "\r\n" + e.message);
                return;
            }
    
            try{
                list = await _db.findAll();            
                _util.gerarLog("registros no banco" + "\r\n" + list.length);  
            } catch (e){
                _util.gerarLog("Erro ao obter registros" + "\r\n" + e.message);
            }
        }  

    }
}




async function cargaInicialObterReclamacao() {    
    var urlAtual = _page.url();
    var re = /pagina=(\d+)/;
    var myArray = re.exec(urlAtual);
    var list = [];

    while (myArray[1] == _pagina){          
        await obterTextoReclamacoes();
        _pagina++
        await acessarSite(_page, _site.format(_busca, _pagina),".complain-list > li > a")
        urlAtual = _page.url();
        myArray = urlAtual.match(re); 

        if(_listaReclamacoes.length >= 100){                   
            list = [];

            try{
                await _db.insertMany(_listaReclamacoes);            
            } catch (e){
                _util.gerarLog("Erro ao salvar registros" + "\r\n" + e.message);
                continue;
            }
    
            try{
                list = await _db.findAll();            
                _util.gerarLog("registros no banco" + "\r\n" + list.length);  
            } catch (e){
                _util.gerarLog("Erro ao obter registros" + "\r\n" + e.message);
            }
            
            _listaReclamacoes = [];  
        }
                  
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
    
    _listaURLReclamacoes = [];
    _listaURLReclamacoes = await _page.$$('.complain-list > li'); 
    
    var quantidadeReclamacoes = Math.trunc(_listaURLReclamacoes.length / 2);

    for (var i = 0; i < quantidadeReclamacoes; i++) {
        _pageReclamacao = await _browser.newPage(); 

        try{
                reclamacao = {};
                urlReclamacao = await _listaURLReclamacoes[i].$eval('a', el => el.href);

                await acessarSite(_pageReclamacao, urlReclamacao, '.complain-head > .row > .col-md-10.col-sm-12 > h1');
        
                titulo = "";
                elementTitulo = null;
                elementTitulo = await _pageReclamacao.$('.complain-head > .row > .col-md-10.col-sm-12 > h1');
                titulo = await _pageReclamacao.evaluate(el => el.textContent, elementTitulo);

                conteudo = "";
                elementConteudo = null;
                elementConteudo = await _pageReclamacao.$('.complain-body > p');
                conteudo = await _pageReclamacao.evaluate(el => el.textContent, elementConteudo);

                reclamacao.titulo = titulo;
                reclamacao.conteudo = conteudo;
                _listaReclamacoes.push(reclamacao);
                _pageReclamacao.close();

        } catch (e) {
                _util.gerarLog("erro no método obterTextoReclamacoes. URL: " + urlReclamacao + "\r\n" + e.message);    
                _pageReclamacao.close();
                throw e;
        }
    }   
    


}

async function acessarSite(page, site, selector) {   
    try{ 
            await _util.sleep(Math.floor(Math.random() * 3000) + 1000);
    
            await _util.tryConnection(page, site, selector, 10);

    } catch (e) {         
            _util.gerarLog("erro no método acessarSite. URL: " + site + "\r\n" + e.message);    
            page.close();
            throw e;
    }

}

