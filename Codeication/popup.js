// This will listen/wait for an oncoming message from background_script.js
// Once the timer is finished the brower will be modified
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log("From popup.js");

	  if (request.message == "finish"){

		let paragraphs = document.getElementsByTagName('p');

		for(i of paragraphs){

			i.style['color'] = 'red'
			i.innerHTML = "<strong>" + request.break + "</strong>"
		}

	  }
		
	});

// Will attach click handlers to each button when the page is initally loaded

function init() {

	reloadPage();
	cancel();
	restart();
	addMessageListeners();		

    document.getElementById("time").innerText = localStorage["time-buttons"] || 10;


	let buttonGroups = document.getElementsByClassName("time-buttons")
	Array.prototype.forEach.call(buttonGroups, function(divElem) {

		Array.prototype.forEach.call(divElem.childNodes, function(elem) {
			elem.onclick = timeButtonOnClickHandler;
		});

	});

}

startTimer();


// function for allowing the user to cancel their current time
// Doing this will allow them to choose a different time
function cancel() {
	document.getElementById("cancel").onclick = function() {

		$('.timer-container').slideUp();

		chrome.runtime.sendMessage({
			"command": "cancelTimer"
		});

		chrome.browserAction.setBadgeText({"text" : ""});

	}
}

// function for restarting timer
function restart(){
	document.getElementById("restart").onclick = function() {

		chrome.runtime.sendMessage({
			"command": "restartTimer"
		});

	}

}

// Send message to Background page to start timer
function startTimer() {
	document.getElementById("startButton").onclick = function(){

		$( ".timer-container" ).slideDown( "slow", function() {

		  });

		chrome.runtime.sendMessage({
			"command": "startTimer"
		}, function(response) {
			console.log(response.message);
		});


	}


}

// // Will reload page when Chrome Extension is used in different browsers
let reloadPage = function(){


	// chrome.tabs.query({active:true, currentWindow: true}, (tabs)=>{
	
	// 	chrome.tabs.reload(tabs[0].id, function(){

			
	// 	});
		
	// });

	chrome.tabs.query({status:'complete'}, (tabs)=>{
		tabs.forEach((tab)=>{
			if(tab.url){
				chrome.tabs.update(tab.id,{url: tab.url});
			 }
			});
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



// Grabbing user inputs
function timeButtonOnClickHandler(event) {
	let targetElem = event.target;
    let timeSelected = +targetElem.innerText; // Get button text and convert to number

    document.getElementById("time").innerText = timeSelected // Will show user what time was selected below buttons 
        
	// localStorage["time-selection"] = timeSelected; // Save in localstorage.
	
	//Saving user data using Storage API.
	chrome.storage.sync.set({'time': timeSelected}, function() {
		
		console.log('You choose ' + timeSelected + ' minutes.' );
	  });
    
}

// function resume() {
	
// 	document.getElementById("resume").onclick = function() {
// 		chrome.runtime.sendMessage({
// 			"command": "resumeTimer"
// 		});
// 	}
// }

// function pause() {
	
// 	document.getElementById("pause").onclick = function() {
// 		chrome.runtime.sendMessage({
// 			"command": "pauseTimer"
// 		});
// 		// document.location = chrome.runtime.getURL("popup.html");
// 		// chrome.browserAction.setBadgeText({"text" : ""});
// 	}
// }


document.addEventListener('DOMContentLoaded', init);


