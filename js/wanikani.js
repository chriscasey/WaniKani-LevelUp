
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

function currentLevelRadicals(data){
	var radicals = "";
	for (pos in data.requested_information) {
		radicals += data.requested_information[pos].character;
	}
	$("#lu-rads").append("<br><p>"+radicals+"</p>");
};

function currentLevelKanji(data){
	var kanji = "";
	for (pos in data.requested_information) {
		kanji += data.requested_information[pos].character;
	}
	$("#lu-kan").append("<br><p>"+kanji+"</p>");
};

function addLevelProgressionData(data) {
	var user_level = data.user_information.level;
	var apiKey = localStorage.getItem('apiKey');

	$(".system-alert").after("<section id='level-up'><h4>LevelUp!</h4></section>");

	//RADICALS
	var rad_prog = data.requested_information.radicals_progress;
	var rad_total = data.requested_information.radicals_total;
	var rad_perc = Math.round((rad_prog / rad_total) * 100);
	$("#level-up").append("<div id='lu-rads'><h3>Radicals: "+rad_prog+"/"+rad_total+" ("+ rad_perc +"%)</h3></div>");

	$.ajax({
		type: 'get',
		url: '/api/user/' + apiKey + '/radicals/' + user_level,
		success: currentLevelRadicals
	});

	//KANJI
	var kan_prog = data.requested_information.kanji_progress;
	var kan_total = data.requested_information.kanji_total;
	var kan_perc = Math.round((kan_prog / kan_total) * 100);
	$("#level-up").append("<div id='lu-kan'><h3>Kanji: "+rad_prog+"/"+kan_total+" ("+ kan_perc +"%)</h3></div>");

	$.ajax({
		type: 'get',
		url: '/api/user/' + apiKey + '/kanji/' + user_level,
		success: currentLevelKanji
	});

}

function insertLevelUpTimeline() {
	var apiKey = localStorage.getItem('apiKey');
	if (apiKey) {
		$.ajax({
			type: 'get',
			url: '/api/user/' + apiKey + '/level-progression',
			success: addLevelProgressionData
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












