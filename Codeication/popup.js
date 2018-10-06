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


// JQuery Code for slider

$(document).ready(function() {

	$("#slider").slider({

		min:10,
		max:150,
		step:10,
		
		change: function(event, ui) {
			$('#time').html(ui.value);
			getUserTime(ui.value);
		}

	});

});


// Will attach click handlers to each button when the page is initally loaded

function init() {

	// reloadPage();
	cancel();
	restart();
	addMessageListeners();		

	document.getElementById("time").innerText = 10;


	let checkTime = document.getElementById("current-time");

	if(checkTime.innerText == 0){

		$('.timer-container').hide();


	}
	// else if(checkTime.innerText != 0) {

	// 	$( ".timer-container" ).show();


	// }
	

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
function getUserTime(getTime) {
	// let targetElem = event.target;
	// // Get button text and convert to number
    // let timeSelected = +targetElem.innerText; 

    // document.getElementById("time").innerText = timeSelected  
        	

	let getMinutes = getTime * 60;

	//Saving user data using Storage API.

	chrome.storage.sync.set({'time': getMinutes}, function() {
		
		console.log('You choose ' + getMinutes/60 + ' minutes.' );
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


