let timer;
let getReloadTimes;
let getStart;

// This will listen/wait for an oncoming message from background_script.js
// Once the timer is finished the brower will be modified
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log("From popup.js");

	  if (request.message == "finish"){

		const randomColors = ['red','blue','purple','yellow','pink','green'];

		let paragraphs = document.querySelectorAll('p,span');
		let headers = document.querySelectorAll('h1,h2,h3,h4');
		let randomValue = Math.floor((Math.random() * randomColors.length));
		let randomValue2 = Math.floor((Math.random() * randomColors.length));


		for(i of paragraphs){

			i.style['color'] = randomColors[randomValue];
			i.innerHTML = "<strong>" + request.break + "</strong>"
		}

		for(i of headers){

			i.style['color'] = randomColors[randomValue2];
			i.innerHTML = "<strong>" + request.break2 + "</strong>"
		}

	  }
		
	});

	

// Will attach click handlers to each button when the page is initally loaded

function init() {

	// JQuery Code for Slider

	$("#slider").slider({

		min:30,
		max:200,
		step:10,
		
		change: function(event, ui) {

			if(ui.value >= 60){
				convertMinutes(ui.value);
			}else{
				$('#time').html(ui.value);
			}
			
			getUserTime(ui.value);

		}

	});

	document.getElementById("time").innerText = 30;
	

	cancel();
	restart();
	addMessageListeners();		

	$('.timer-container').hide();

}

// Converting Minutes to Hours when minutes go greater than 60 minutes

let convertMinutes = (value) => {
	let hour = Math.floor(value/60);
	let minutes = value % 60;

	if(hour > 1){
		$('#time').html(hour + " hours and " + minutes);
	}else{
		$('#time').html(hour + " hour and " + minutes);
	}
}


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

			console.log("Start: " + getStart);

			// If getStart is undefined it will reload all current tabs open
			// But next time this callback function occurs, getStart will be 'True'
			// thus it won't force a relaod to all current tabs open
			if(getStart === undefined){

				getStart = true;
				reloadPage();
			}
			
		});

		chrome.runtime.sendMessage({
			"command": "startTimer"
		}, function(response) {
			console.log(response.message);
		});

	}

}

startTimer();


// // Will reload page when Chrome Extension is used in different browsers
let reloadPage = () => {

	
	// chrome.tabs.query({active:true, currentWindow: true}, (tabs)=>{
	
	// 	chrome.tabs.reload(tabs[0].id, function(){

			
	// 	});
		
	// });

	// Need to check whether the tabs have completed loading
	chrome.tabs.query({status:'complete'}, (tabs)=>{

		tabs.forEach((tab)=>{

			// This if will force reload all tabs when accessing extension
			if(tab.url){

				chrome.tabs.update(tab.id,{url: tab.url});

			 }
			 
			});

		});
}

// Handling various messages from background page to check whether timer has ended or to keep updating timer
function addMessageListeners() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

		timer = request.time;

		let checkTime = request.time;

		/* This if statement will check if the timer has started. If true, the timer 
		will always be visible for the user whether they click on/off of the application.
		Timer will remain hidden until the user has choosen a time.
		*/

		if(checkTime){

			$('.timer-container').slideDown();

		}

		switch(request.command) {
			case "updateTime":
				document.getElementById("current-time").innerText = checkTime;
				break;
			case "timerEnded":
				
				console.log("Timer ended.");
				break;
		}
	});
}


// Grabbing user inputs
function getUserTime(getTime) {
	
	let getMinutes = getTime * 60;

	//Saving user data using Storage API.

	chrome.storage.sync.set({'time': getMinutes}, function() {
		
		// console.log('You choose ' + getMinutes/60 + ' minutes.' );
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

// This event will get the DOM ready to go
// document.addEventListener('DOMContentLoaded', init);
window.onload = init();


