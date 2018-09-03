console.log("background running");

// Global Variables
let timerStates = {
	"off" : {"state": "off", "html": "popup.html", "nextState": "pomodoro"},

},
    stateKey = "off",
    currentState = timerStates[stateKey],
    timer,
    timeout;



// Add message listeners for messages from programmingTimer.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// Only start timer if timer was initially off. No delay.
		if (request.command === "startTimer" && stateKey === "off") {
			startTimer()
			// changeToNextState(false);

			sendResponse({message: "Timer started."});
		}
		// Only clear timers if timer is not off.
		else if (request.command === "endTimer" && stateKey !== "off") {
			if (timer) clearInterval(timer);
			if (timeout) clearTimeout(timeout);
			timeout = null;
			timer = null;
			// changeState("off", false); // Change to off state
			chrome.runtime.sendMessage({
				command: "timerEnded"
			});
		}
	});

/**
 * Helper Functions
 */

// Start Timer is responsible for sending updates to programmingTimer.js every second
function startTimer() {

	let options = {
		message: "finish",
		break:"Take a Break!"

	}
	let start = moment();
	timer = setInterval(function() {
		let difference = moment().diff(start, 'seconds');
		
		let length = localStorage["time-selection"] || 10
	    if (difference > length) {
			stopTimer(timer);

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, options, function(response) {
				  console.log(response.farewell);
				});
			  });

			return;
			
	    }
	    sendUpdatedTime(difference);
	}, 1000);
}

// Will send a message to programmingTimer.js to keep updating the time in m:ss format
function sendUpdatedTime(difference) {
	var time = moment().startOf("day").seconds(difference).format("m:ss");
	chrome.runtime.sendMessage({
		"command": "updateTime",
		"time": time
	});
	chrome.browserAction.setBadgeText({"text" : time});
}

// Will notify user when time is over
function stopTimer() {
	clearInterval(timer);
	timer = null;
	notifyUser();

	// changeToNextState(true);
	chrome.runtime.sendMessage({
		command: "timerEnded"
	});
}

// Creates chrome notification 
function notifyUser() {
	// var idBase = currentState.notificationBaseId;
	// var id = idBase + (new Date()).getTime();

		let options = {


			type:'basic',
			iconUrl:'main.png',
			title:'Break Time!',
			message:'Hey there take a break from coding!'
		
		}


	chrome.notifications.create(options, function() {
		console.log(" notification created.");
	}); // Callback function as 3rd parameter is required.
}

// /**
//  * Called during a change of state during usual flow.
//  */
// function changeToNextState(isDelayed) {
// 	nextStateKey = currentState.nextState;
// 	changeState(nextStateKey, isDelayed);
// }

/**
 * Called when we want to change to a specific state. isDelayed parameter allows
 * us to introduce a delay for before the next timer is started (ex. 10 seconds
 * between the pomodoro period is over and the break begins to give user time to
 * wrap up.).
 */
// function changeState(nextStateKey, isDelayed) {
// 	stateKey = nextStateKey;
// 	currentState = timerStates[stateKey];
// 	chrome.browserAction.setPopup({
// 		"popup": currentState.html
// 	});

// 	// We know it's a time period of some sort.
// 	if (currentState.hasOwnProperty("length")) {
// 		// Delay?
// 		if (isDelayed) {
// 			timeout	= setTimeout(startTimer, currentState.delay*1000);
// 		}
// 		else startTimer();
// 	}
// }


// function changeInnerText(){



	// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	// 	chrome.tabs.sendMessage(tabs[0].id, {message: "finish"}, function(response) {
	// 	  console.log(response.farewell);
	// 	});
	//   });


// }



