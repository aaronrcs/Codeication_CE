// This will listen/wait for an oncoming message from background_script.js
// Once the timer is finished the brower will be modified
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  console.log("From popup.js");

	  if (request.message == "finish"){

		let paragraphs = document.getElementsByTagName('p');

		for(i of paragraphs){

			// 0%   {background-color:red; left:0px; top:0px;}
    		// 25%  {background-color:yellow; left:200px; top:0px;}

			// $("p").css({"background-color": "red", "left": "0px","top":"0px",""});

			i.style['color'] = 'red'
			i.innerHTML = "<strong>" + request.break + "</strong>"
		}

	  }
		
	});




// Will attach click handlers to each button when the page is initally loaded

function init() {

	// JQuery Code for Slider

	$("#slider").slider({

		min:10,
		max:150,
		step:10,
		
		change: function(event, ui) {
			$('#time').html(ui.value);
			getUserTime(ui.value);

		}

	});

	document.getElementById("time").innerText = 10;


	reloadPage();
	cancel();
	restart();
	addMessageListeners();		


	$('.timer-container').hide();


	

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
document.addEventListener('DOMContentLoaded', init);


