var socket = io();

socket.on("connect", function() {
	console.log("Connected to socket server!");
});


var maxAnswersReached = 0;
var lastDisplayByInput = 1;
var displayIDs = new Array();
var totalAnswers = 100000;


socket.on("display message", function (message) {

	if(message.startsWith("Bob:")){
		message = message.slice(4,message.length);


		document.getElementById('sound1').play();
		
		timerStop();
		var classIndex =(Math.floor(Math.random() * classNames.length)) % classNames.length;

		var messageIndex = localStorage.getItem("messageCount-B");
		
			var messageStorageName = "message" + messageIndex;
	 		localStorage.setItem(messageStorageName, message);

	 		var classStorageName = "class" + messageIndex;
	 		localStorage.setItem(classStorageName, classIndex);

	 		localStorage.setItem("messageCount-B",++messageIndex);
	
		if(messageIndex >= totalAnswers){

			localStorage.setItem("totalAnswersOverHundred", 1);	
			localStorage.setItem("messageCount-B", 0);	
		}

		showMessages(1);
		lastDisplayByInput = 1;
		timerStart();

	}else{
		message = " ";
	}
});		



var messageHistory = new Array();
var classNamesIndex = new Array();
for (var i = 0; i<totalAnswers; i++){
	messageHistory[i] = "";
	classNamesIndex[i] = 0;
}

var rotateTimer;


function rotateAnswerOnTimer(){
	showMessages(0);
	lastDisplayByInput = 0;
	timerStart();
	}



function timerStart() {
    rotateTimer = setTimeout(rotateAnswerOnTimer, 60000);
}

function timerStop() {
    clearTimeout(rotateTimer);
}


var classNames = new Array();
function showMessages(currentDisplayByInput) {
		
		nextShowIndex(currentDisplayByInput);
		displayIndex = localStorage.getItem("showIndex");
		
			for (var i = 0; i<displayIDs.length; i++){
				displayIDs[i].style.visibility = "visible";
				
				var messageStorageName = "message" + displayIndex;
 				var classStorageName = "class" + displayIndex;
	
				displayIDs[i].innerHTML = localStorage.getItem(messageStorageName);
				displayIDs[i].className = classNames[localStorage.getItem(classStorageName)];

	 			displayIndex = nextDisplayIndex(displayIndex) 
	 			if ( displayIndex  == -1 ) {
	 				return;
	 			}
	 		}
	 	}

function nextMessageIndex(){
	if(++messageIndex >= totalAnswers){
		messageIndex = 0;
	}
	return messageIndex;
}

function nextShowIndex(currentDisplayByInput){
	var messageIndex = localStorage.getItem("messageCount-B");
	var showIndex = localStorage.getItem("showIndex");
	if(lastDisplayByInput == 0 && currentDisplayByInput == 1){
		if (maxAnswersReached == 1 || messageIndex > displayIDs.length){
			showIndex = messageIndex - displayIDs.length;
			if(showIndex<0){
				showIndex += total;
			}
		}
	}else{
		if(maxAnswersReached==1 || messageIndex > displayIDs.length){
			showIndex++;
				if(maxAnswersReached==1){
					if(showIndex >= messageHistory.length){
						showIndex = 0;
					}
				}if(showIndex >= messageIndex){
					showIndex = 0;
				}
		}
	}
	localStorage.setItem("showIndex", showIndex);
}


function nextDisplayIndex(displayIndex){
	var messageIndex = localStorage.getItem("messageCount-B");
	var totalAnswersOverHundred = localStorage.getItem("answersOverHundred");
	if(	++displayIndex == messageIndex && messageIndex <= displayIDs.length && maxAnswersReached == 0 ) {
     	return -1;
	}
	if(maxAnswersReached == 1){
		if(displayIndex>totalAnswers){
			displayIndex = 0;
		}
	}else if (displayIndex >= messageIndex){
		displayIndex = 0;
	} 
	return displayIndex;
}
 


