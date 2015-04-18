/**
 *AUTHOR: Jacob Kromm jacobkromm0@gmail.com
 *VERSION: 1.0
 *CREATED: 4.7.2015
 *ASSIGNMENT: baseball SPA
 *TODO: Fix issue of Batters and Fielders altering each other, Undo button, Remove deleted person's array position from presentPlayers
 */

"use strict";

/** @type {boolean} */
var  areHomeTeam,
	topOfInning,
	areOffense;


/** @type {number} */
var  strikes,
	outs,
	fouls,
	balls,
	runs,
	ourScore,
	theirScore,
	inningNum,
	playerNum;

/** @type {Array}.<string> */
var  players = [],
	presentPlayers = [],
	fielders = [],
	batters = [];

function setPlayersArray() {
	/** @type {Array.<string>} */
	var lines = [];
	$.ajax({
		url: 'data/players.csv',
		contentType: "text/csv",
		async: false,
		success: function(text) {
			lines = text.split(/\n/);
		}
	});
	for (var i = 0; i < lines.length; i++) {
		lines[i] = lines[i].replace(/(\r\n|\n|\r)/gm,"");
		players[i] = lines[i].split(",");
	}
	setAvailablePlayers();
}

function setAvailablePlayers() {
	for (var i = 0; i < players.length; i++) {
		var playerDiv = '<div class="small-9 column" id="player.' + i + '">' +
			'<h2>' + players[i][1] + " " + players[i][0] + '</h2>' +
			'</div>' +
			'<div id="checkbox.' + i + '" class="switch round large small-3 columns">' +
			'<input id="present.' + i + '" type="checkbox" />' +
			'<label for="present.' + i + '"></label>' +
			'</div>';
		$('#attendance').append(playerDiv);
	}
}

function setPresentPlayers() {
	playerNum = 0;
	$("#attendance").change(function(event) {
		/** @type {Array}.<string> */
		var playerID = event.target.id.split(".");
		if ($(event.target).is(':checked')) {
			presentPlayers[playerNum] = players[playerID[1]][1] + ' ' + players[playerID[1]][0];
			playerNum++;
		} else {
			delete presentPlayers[playerID[1]];
		}
	});
}

function setBatters() {
	batters = presentPlayers;
}

function outputBatters() {
	/** @type {string} */
	var batter = '<h2>' + batters[0] + '</h2>',
		onDeck = '<h2>' + batters[1] + '</h2>' + '<h2>' + batters[2] + '</h2>' + '<h2>' + batters[3] + '</h2>';
	$('#currentBatter').html(batter);
	$('#onDeck').html(onDeck);
}

function setFielders() {
	fielders = presentPlayers;
}

function outputFielders() {
	var positions = '<h2><strong>C =</strong> ' + fielders[0] + '</h2>' +
			'<h2><strong>P =</strong> ' + fielders[1] + '</h2>' +
			'<h2><strong>1B =</strong> ' + fielders[2] + '</h2>' +
			'<h2><strong>2B =</strong> ' + fielders[3] + '</h2>' +
			'<h2><strong>3B =</strong> ' + fielders[4] + '</h2>' +
			'<h2><strong>SS =</strong> ' + fielders[5] + '</h2>' +
			'<h2><strong>LF =</strong> ' + fielders[6] + '</h2>' +
			'<h2><strong>CF =</strong> ' + fielders[7] + '</h2>' +
			'<h2><strong>RF =</strong> ' + fielders[8] + '</h2>';
	if (fielders >= 9) {
		positions = positions + '<h2><strong>CF2 =</strong> ' + fielders[9] + '</h2>';
	}
	$('#fieldPositions').html(positions);
}

function advanceBatters() {
	/** @type {string} */
	var temp1 = batters.shift();
	batters.push(temp1);
}

function advanceFielders() {
	/** @type {string} */
	var temp2 = fielders.shift();
	fielders.push(temp2);
}

function resetInning() {
	strikes = 0;
	outs = 0;
	fouls = 0;
	balls = 0;
	runs = 0;

	if (!inningNum) {
		inningNum = 1;
	}
	if (topOfInning === undefined) {
		topOfInning = true;
		$("#inningState").html('<h2 class=" text-center fa fa-arrow-circle-up"></h2>');
		$("#inningNum").html('<h2 class="text-left">' + inningNum + '</h2>');
	} else if (topOfInning === true) {
		topOfInning = false;
		$("#inningState").html('<h2 class="text-center fa fa-arrow-circle-down"></h2>');
	} else if (topOfInning === false) {
		topOfInning = true;
		inningNum++;
		$("#inningNum").html('<h2 class="text-left">' + inningNum + '</h2>');
		$("#inningState").html('<h2 class="text-center fa fa-arrow-circle-up"></h2>');
	}
	
	if (inningNum > 9) {
		gameOver();
	}

	$("#strikeCounter").text(strikes);
	$("#outCounter").text(outs);
	$("#foulCounter").text(fouls);
	$("#ballCounter").text(balls);
	$("#runCounter").text(runs);
	$("#inningCounter").text(inningNum);
}

function startScreen() {
	$("#offense").hide();
	$("#defense").hide();
	$("#inning").hide();
	$("#actions").hide();
	$("#over").hide();
	$("#note").hide();
	$("#attendance").show();
	$("#teamSelect").show();
	$("#score").show();
	homeButtonClick();
	awayButtonClick();
}

function defenseSet() {
	$("#offense").hide();
	$("#inning").show();
	$("#actions").show();
	$("#attendance").hide();
	$("#teamSelect").hide();
	$("#over").hide();
	$("#note").hide();
	$("#score").show();
	$("#defense").show();
	areOffense = false;
	resetInning();
	advanceFielders();
	outputFielders();
}

function offenseSet() {
	$("#defense").hide();
	$("#inning").show();
	$("#actions").show();
	$("#over").hide();
	$("#note").hide();
	$("#attendance").hide();
	$("#teamSelect").hide();
	$("#score").show();
	$("#offense").show();
	areOffense = true;
	resetInning();
	outputBatters();
}

function homeButtonClick() {
	$("#homeTeam").click(function() {
		setBatters();
		setFielders();
		defenseSet();
		ourScore = 0;
		theirScore = 0;
		areHomeTeam = true;
	});
}

function awayButtonClick() {
	$("#visitorTeam").click(function () {
		setBatters();
		setFielders();
		offenseSet();
		ourScore = 0;
		theirScore = 0;
		areHomeTeam = false;
	});
}

function strikeButtonClick() {
	$("#strikeButton").click(strike());
}

function strike() {
	strikes++;
	if (strikes >= 3) {
		out();
		strikes = 0;
		fouls = 0;
		balls = 0;
		if (areOffense === true) {
			advanceBatters();
			outputBatters();
		}
	}
	$("#strikeCounter").text(strikes);
	$("#ballCounter").text(balls);
	$("#foulCounter").text(fouls);
}

function ballButtonClick() {
	$("#ballButton").click(function() {
		ball();
	});
}

function ball() {
	balls++;
	if (balls >= 4) {
		base();
	}
	$("#ballCounter").text(balls);
}

function foulButtonClick() {
	$("#foulButton").click(function() {
		foul();
	});
}

function foul() {
	fouls++;
	if (fouls <= 2 && fouls >= strikes) {
		strikes = fouls;
	}
	$("#strikeCounter").text(strikes);
	$("#foulCounter").text(fouls);

}

function outButtonClick() {
	$("#outButton").click(function() {
		out();
	});
}

function out() {
	outs++;
	if (outs >= 3) {
		if (areOffense === true) {
			defenseSet();
		} else if(areOffense === false) {
			offenseSet();
		}
	}
	$("#outCounter").text(outs);
}

function runButtonClick() {
	$("#runButton").click(function() {
		run();
	});
}

function run() {
	runs++;
	$("#runCounter").text(runs);
	if (areOffense === true) {
		ourScore = ourScore + 1;
		$("#ourScore").text(ourScore);
	} else if(areOffense === false) {
		theirScore = theirScore + 1;
		$("#theirScore").text(theirScore);
	}

}

function baseButtonClick() {
	$("#baseButton").click(function() {
		base();
	});
}

function base() {
	strikes = 0;
	fouls = 0;
	balls = 0;
	$("#strikeCounter").text(strikes);
	$("#foulCounter").text(fouls);
	$("#ballCounter").text(balls);
	if (areOffense === true) {
		advanceBatters();
		outputBatters();
	}
}

function gameOver() {
	$("#offense").hide();
	$("#defense").hide();
	$("#inning").hide();
	$("#actions").hide();
	$("#over").show();
	$("#note").show();
	$("#attendance").hide();
	$("#teamSelect").hide();
	$("#score").show();
	
	if (ourScore > theirScore) {
		$("#winner").append("Us");
		$("#loser").append("Them");
	} else if (theirScore > ourScore) {
		$("#winner").append("Them");
		$("#loser").append("Us");
	} else if (ourScore === theirScore) {
		$("#winner").append("Tie");
		$("#loser").append("Tie");
	}
}

window.onload = function() {
	setPlayersArray();
	startScreen();
	setPresentPlayers();
	strikeButtonClick();
	outButtonClick();
	foulButtonClick();
	ballButtonClick();
	runButtonClick();
	baseButtonClick();
};