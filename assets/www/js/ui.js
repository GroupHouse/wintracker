/*

 UI assist functions
yo
*/

//show a loading screen when launched, until we get the user's session back
setAction("Loading Win Tracker", true);

//Swaps the pages out when the user taps on a choice
function openPage(pageName, ignoreHistoryPush, id) {
  window.scrollTo(0,1);

  var els = document.getElementsByClassName('page');
  
  for (var i = 0 ; i < els.length ; ++i) {
    els[i].style.display = 'none';
  }
  
  var page = document.getElementById('page-' + pageName);
  console.log("page is " + page);
  
  page.style.display = "block";
  
  title = (pageName == 'root') ? 'Welcome to Game Night' : pageName.replace(/-/g, ' ');
  
  if (ignoreHistoryPush != true) {
    window.history.pushState({page: pageName}, '', document.location.origin + document.location.pathname + "#" + pageName);
  }

 
  document.getElementById('back').style.display = (pageName == 'root') ? 'none' : 'block';
  document.getElementById('save').style.display = (pageName == 'root') ? 'none' : 'block';


  if (pageName == "LogaWin")
  {
  	console.log("What game did you play");
  	document.getElementById('title').innerHTML = "What game did you play";
  	
  	document.getElementById('save').style.display = (pageName == 'LogaWin') ? 'none' : 'block';
  	document.getElementById('CommonAll').style.display = (pageName == 'LogaWin`') ? 'visible' : 'block';
  	if (defaultlist == 1)
  	{
  	LoadGames("common");
  	}
  	else
  	{
  	LoadGames();
  	}
  
  }
   if (pageName == "Details")
  {
  	console.log("When You Played?");
  	document.getElementById('title').innerHTML = "Times & Players";
  	document.getElementById('save').style.display = (pageName == 'Details') ? 'none' : 'block';
  		document.getElementById('CommonAll').style.display = (pageName == 'Details') ? 'none' : 'block';
  		  	document.getElementById('save').style.display = (pageName == 'Details') ? 'none' : 'block';

  
  	  	LoadGames("datestimes", id);
  
  }
  
   if (pageName == "Statistics")
  {
  	console.log("Which Game?");
  	document.getElementById('title').innerHTML = "Choose a Game";
  	document.getElementById('save').style.display = (pageName == 'Statistics') ? 'none' : 'block';
  		document.getElementById('CommonAll').style.display = (pageName == 'Statistics') ? 'none' : 'block';
  
  	  	LoadGames("stats");
  
  }
     if (pageName == "GamesStats")
  {
  	console.log("Game Statistics");
  	document.getElementById('title').innerHTML = "Game Stats";
  	document.getElementById('save').style.display = (pageName == 'GamesStats') ? 'none' : 'block';
  		document.getElementById('CommonAll').style.display = (pageName == 'GamesStats') ? 'none' : 'block';
  	//document.getElementById('gameid').innerHTML = id;

  	LoadStats(id);
  
  }
    if (pageName == "players")
  {
  	document.getElementById('title').innerHTML = "Choose Players";
  	document.getElementById('save').innerHTML = "Save";

  	 if (defaultlist == 1)
  	 {
  	 	getUserFriends();
		getUserFriends("common");  	
	 }
  	 else
  	 {
		getUserFriends();
  	 }
	
	document.getElementById('CommonAll').style.display = (pageName == 'feedback') ? 'visible' : 'block';
  	document.getElementById('gameid').innerHTML = id;

  	console.log("added id to page: " + document.getElementById('gameid').innerHTML);

  }
    if (pageName == "feedback")
 	{
  	document.getElementById('title').innerHTML = "Feedback";
	LoadSurvey();
	document.getElementById('save').innerHTML = "Send";
	document.getElementById('CommonAll').style.display = (pageName == 'feedback') ? 'none' : 'block';


  }
      if (pageName == "Settings")
 	{
  	document.getElementById('title').innerHTML = "Settings";
	//document.getElementById('save').innerHTML = "Send";
	document.getElementById('CommonAll').style.display = (pageName == 'Settings') ? 'none' : 'block';
  	document.getElementById('save').style.display = (pageName == 'Settings') ? 'none' : 'block';
  	if (defaultlist == 0)
  	{
  		document.getElementById('request_default').innerHTML = "List start w/ All"
  	}
  	else
  	{
  		document.getElementById('request_default').innerHTML = "List start w/ Recent"

  	}

  }
     if (pageName == "root")
 	{
  	document.getElementById('title').innerHTML = "Welcome to Game Night";
  	document.getElementById('CommonAll').style.display = (pageName == 'root') ? 'none' : 'block';
  	document.getElementById('CommonAll').style.display = (pageName == 'root') ? 'none' : 'block';
	 //$("#home li").show();
	
  }
    
  
  
}

window.onpopstate = function(e) {
  if (e.state != null) {
    console.log(e.state);
    openPage(e.state.page);
  }
  else {
    openPage('root', true);
  }
}

openPage('root', true);

//Shows a modal dialog when fetcing data from Facebook
function setAction(msg, hideBackground) {
  document.getElementById('action').style.display = 'block';
  
  if (hideBackground) {
    document.getElementById('action').style.opacity = '100';
  }
  else {
    document.getElementById('action').style.opacity = '.9';
  }
  
  document.getElementById('msg').innerHTML = msg;
  
  window.scrollTo(0, 1);
}

//Clears the modal dialog
function clearAction() {
  document.getElementById('msg').innerHTML = '';
  
  document.getElementById('action').style.display = 'none';
}

//Automatically scroll away the address bar
addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);

function hideURLbar() {
  window.scrollTo(0,1);
}

function hideButton(button) {
  button.style.display = 'none';
}
