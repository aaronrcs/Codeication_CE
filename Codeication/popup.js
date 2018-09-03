

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

	

    document.getElementById("time").innerText = localStorage["time-buttons"] || 10;


	let buttonGroups = document.getElementsByClassName("time-buttons")
	Array.prototype.forEach.call(buttonGroups, function(divElem) {

		Array.prototype.forEach.call(divElem.childNodes, function(elem) {
			elem.onclick = timeButtonOnClickHandler;
		});

	});

}

// Grabbing button data
function timeButtonOnClickHandler(event) {
	let targetElem = event.target;
    let timeSelected = +targetElem.innerText; // Get button text and convert to number

    document.getElementById("time").innerText = timeSelected // Will show user what time was selected below buttons 
        
	localStorage["time-selection"] = timeSelected; // Save in localstorage.
	
	//Saving user data using Storage API.
	// chrome.storage.sync.set({'time': timeSelected}, function() {
		
	// 	console.log('You choose ' + timeSelected + ' minutes.' );
	//   });
    
}


document.addEventListener('DOMContentLoaded', init);


