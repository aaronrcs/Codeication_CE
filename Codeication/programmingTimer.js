
function init() {
	

	addOnClick();
	addMessageListeners();
	startTimer();
}

// Send message to Background page to start timer
function startTimer() {
	chrome.runtime.sendMessage({
		"command": "startTimer"
	}, function(response) {
		console.log(response.message);
	});
}

// Handling various messages from background page to check whether timer has ended or to keep updating timer
function addMessageListeners() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.command) {
			case "updateTime":
				document.getElementById("current-time").innerText = request.time;
				break;
			case "timerEnded":
				
				console.log("Timer ended.");
				break;
		}
	});
}

/**
 * Adds onclick listener to the stop button.
 */
function addOnClick() {
	document.getElementById("stop").onclick = function() {
		chrome.runtime.sendMessage({
			"command": "endTimer"
		});
		// document.location = chrome.runtime.getURL("popup.html");
		chrome.browserAction.setBadgeText({"text" : ""});
	}
}




document.addEventListener('DOMContentLoaded', init);