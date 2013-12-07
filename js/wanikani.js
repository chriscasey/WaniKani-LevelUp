
var chromeExt = typeof chrome != 'undefined';

function injectJS(scriptName) {
	var s = document.createElement('script');
	s.type = 'text/javascript';
	if (chromeExt) {
		s.src = chrome.extension.getURL(scriptName + '.js');
	} else {
		s.src = safari.extension.baseURI + scriptName + '.js';
	}
	s.onload = function() {
	    this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}

function createSheet(name) {
	var sheet = document.createElement('link');
	sheet.type = 'text/css';
	sheet.rel = 'stylesheet';
	sheet.href = chrome.extension.getURL("css/" + name + '.css');
	(document.head||document.documentElement).appendChild(sheet);
	return sheet;
}

function addLevelData(data) {
	$(".system-alert").after("<section id='level-up'><h4>LevelUp!</h4></section>");

	//RADICALS
	var rad_prog = data.requested_information.radicals_progress;
	var rad_total = data.requested_information.radicals_total;
	var rad_perc = Math.round((rad_prog / rad_total) * 100);
	$("#level-up").append("<h3>Radicals: "+rad_prog+"/"+rad_total+" ("+ rad_perc +"%)</h3>");

	//KANJI
	var kan_prog = data.requested_information.kanji_progress;
	var kan_total = data.requested_information.kanji_total;
	var kan_perc = Math.round((kan_prog / kan_total) * 100);
	$("#level-up").append("<h3>Kanji: "+rad_prog+"/"+kan_total+" ("+ kan_perc +"%)</h3>");

	$("#level-up").append("<br>");
}

function insertLevelUpTimeline() {
	var apiKey = localStorage.getItem('apiKey');
	if (apiKey) {
		//LEVEL DATA
		http://www.wanikani.com/api/user/69559ee508d313c400fd27169fc9f2fe/level-progression
		$.ajax({
			type: 'get',
			url: '/api/user/' + apiKey + '/level-progression',
			success: addLevelData
		});
	} else {
		document.location.pathname = '/account';
	}
}


$(document).ready(function() {
	var loc = document.location;
	if (!chromeExt && loc.hostname.indexOf('wanikani') === -1)
		return;
	createSheet('main');

	var splitted = loc.pathname.split('/');
	var siteSection = splitted[1];
	if (!siteSection || siteSection === 'dashboard') {
		insertLevelUpTimeline();
	} else if (siteSection == 'account') {
		apiKey = $('input[placeholder="Key has not been generated"]').val();
		var alreadySaved = localStorage.getItem('apiKey');
		localStorage.setItem('apiKey', apiKey);
		if (!alreadySaved)
			document.location.pathname = '/dashboard';
	}
});












