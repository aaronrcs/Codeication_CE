console.log("background running");

// Global Variables
let 
	timer,
	currentTime,
    timeout;


// Add message listeners for messages from programmingTimer.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command === "startTimer") {
			startTimer(currentTime);

			sendResponse({message: "Timer started."});
		}

		else if (request.command === "pauseTimer") {
			if (timer){
				clearInterval(timer);
			} 

			console.log("Paused Timer (Current Time): " + currentTime);
			
			chrome.runtime.sendMessage({
				command: "timerEnded"
			});
		}
		else if (request.command === "cancelTimer"){

			clearInterval(timer);
			timer = null;
		}
		else if(request.command === "restartTimer"){

			clearInterval(timer);
			timer = null;

			startTimer(currentTime);

		}

		// else if (request.command === "resumeTimer"){

		// 	console.log("Resume time: " + currentTime);

		// 	// if(!timer){
		// 		setInterval(startTimer,currentTime);
		// 	// }
		// }
		
	});



// Start Timer is responsible for sending updates to programmingTimer.js every second
function startTimer(getTime) {

	let options = {
		message: "finish",
		break:"Take a Break!"

	}
	// Using the moment.js library
	let start = moment();
	timer = setInterval(function() {
		
		getTime = moment().diff(start, 'seconds');
		currentTime = getTime

		chrome.storage.sync.get(['time'], function(result) {
			console.log('Your time is currently ' + result.time);


			// let length = localStorage["time-selection"] || 10

	        if (currentTime > result.time) {
				stopTimer(timer);

				// Will send a message to Popup.js when timer is done for for the tab the user is currently on
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			
					chrome.tabs.sendMessage(tabs[0].id, options, function() {

					});					
				});
			return;		
	    }
	    	sendUpdatedTime(currentTime);

		});
				
	}, 1000);
}

// Will send a message to popup.js to keep updating the time in m:ss format
function sendUpdatedTime(difference) {
	let time = moment().startOf("day").seconds(difference).format("m:ss");

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

	chrome.runtime.sendMessage({
		command: "timerEnded"
	});
}

// Creates chrome notification 
function notifyUser() {

		let options = {

			type:'basic',
			iconUrl:'main.png',
			title:'Break Time!',
			message:'Hey there take a break from coding!'
		
		}

	chrome.notifications.create(options, function() {
		console.log(" notification created.");
	}); 
}







