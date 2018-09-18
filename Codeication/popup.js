
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


// Will attach click handlers to each button when the page is initally loaded

function init() {

	reloadPage();
		

    document.getElementById("time").innerText = localStorage["time-buttons"] || 10;


	let buttonGroups = document.getElementsByClassName("time-buttons")
	Array.prototype.forEach.call(buttonGroups, function(divElem) {

		Array.prototype.forEach.call(divElem.childNodes, function(elem) {
			elem.onclick = timeButtonOnClickHandler;
		});

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


document.addEventListener('DOMContentLoaded', init);


