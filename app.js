var __dirname = "/home/georgevepo/Desktop/PPMercadoOnline-BigData-main";
var fs = require("fs");
var util = require('./util/util.js');
var db = require('./data/db.js');
var reclameAqui = require('./webscrapper/reclameaqui.js');
var urls = require('./conn/urls.js');
const killChrome = require('kill-chrome');
var cargaInicial = true;


async function executarMonitoramento(cargaInicial) {
	fs.appendFile(__dirname + '//Log.txt', "\r\n" + util.getDate() + "\r\nMonitoramento executado\r\n", function (err) {});
	
	try{
	reclameAqui.ExecutarMonitoramento(urls.ObterURLUberEats, __dirname, cargaInicial)
	.then(async function(retorno)  {		
		return db.insertMany(retorno).then(async function()  {
			return reclameAqui.ExecutarMonitoramento(urls.ObterURLIFood, __dirname, cargaInicial);
		});		 
	}).then(async function(retorno)  {
		return db.insertMany(retorno).then(async function()  {
			return reclameAqui.ExecutarMonitoramento(urls.ObterURLRappi, __dirname, cargaInicial);
		});		 		
	}).then(async function(retorno)  {	
		return db.insertMany(retorno).then(async function()  {
			return reclameAqui.ExecutarMonitoramento(urls.ObterURLJamesDelivery, __dirname, cargaInicial);
		});		 
	}).then(async function(retorno)  {
		return db.insertMany(retorno);	
	});
} catch (e) {
	var today = util.getDate();
	fs.appendFile(__dirname + '//Log.txt', "\r\n" + today + "\r\n" + e.message + "\r\n", function (err) {});
}
}

const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');  
});

server.listen(port, hostname, () => {
  console.log(util.getDate() + ` - Server running at http://${hostname}:${port}/`);
  
  executarMonitoramento(cargaInicial).then(function () {
  setInterval(async function () {
	killChrome().then(async function () {
		executarMonitoramento(cargaInicial).then(function () {
			killChrome();
			cargaInicial = false;
		});	
	});			
	}, 86400000);	
});	
});
