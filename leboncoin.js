'use strict';

var request = require('request');
var cheerio = require('cheerio');

var url = 'http://www.leboncoin.fr/ventes_immobilieres/915700197.htm?ca=12_s'


request(url, function (error, response, html) {
  if (!error) {
	var $ = cheerio.load(html);
    
	
	var price = parseInt($("[itemprop='price']").text().replace(" ", ""));
	
	var city = $("[itemprop='addressLocality']").text();

	var postalCode = parseInt($("[itemprop='postalCode']").text());
	
	//var toGoodType = $('div .lbcParams criterias');
	//var good = $('div .lbcParams criterias').children().children().children().children[2].text();
	
	var tabElement = $("[class='lbcParams criterias'] > table > tr > td");
    var typee = tabElement[0].children[0].data;
    var piecee = parseInt(tabElement[1].children[0].data.replace(" ",""));
    var surfacee = parseInt(tabElement[2].children[0].data.replace(" ",""));
	
	console.log(price);
	console.log(city);
	console.log(typee);
	console.log(piecee);
	console.log(surfacee);
	
  }
  
});