var _puppeteer = require('puppeteer');
var _util = require('../util/util.js');
var _pagina = 1;
var _busca = "Supermercado";
var _page = {};
var _browser = {};
var _listaReclamacoes = [];
var _pageReclamacao = {};
var _site = "";
String.prototype.format = _util.format;

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
            await acessarSite(_page, _site.format(_busca, _pagina), ".complain-list > li");
    
            if(cargaInicial){
                await cargaInicialObterReclamacao();
    
            } else{
                await obterTextoReclamacoes();
            }                    
             
        } catch (e) {
            _util.gerarLog(e.message);
            return "raspagem indisponivel";
        }
    
        _page.close();
        _browser.close();
    
        return _listaReclamacoes;   

    }
}




async function cargaInicialObterReclamacao() {    
    var urlAtual = _page.url();
    var re = /pagina=(\d+)/;
    var myArray = re.exec(urlAtual);

    while (myArray[1] == _pagina){
        myArray = urlAtual.match(re);        

        await obterTextoReclamacoes();
        _pagina++
        await acessarSite(_page, _site.format(_busca, _pagina),".complain-list > li")
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

        await acessarSite(_pageReclamacao, urlReclamacao, '.complain-head > .row > .col-md-10 .col-sm-12 > h1');

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
                _util.gerarLog("erro no método obterTextoReclamacoes. URL: " + urlReclamacao + "\r\n" + e.message);    
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
            _util.gerarLog("erro no método acessarSite. URL: " + site + "\r\n" + e.message);    
            page.close();
    }

}

