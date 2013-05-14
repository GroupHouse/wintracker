var sList;						//Helps loop through the checkboxes
var winners = new Array();		//Holds all winner IDs
var names = new Array();		//Holds all player names (including winners)
var winnernames = new Array();	//Holds all winner names
var dates = new Array();	
var players = new Array();		//Holds all players ID (including winners)
jsonObj ='[';					
jsonObj1 ='[';
totalplays = 0;
var i = 0;
var w = 0;
var defaultlist = 0;			//If default list = 0 then we are going to show default lists to common
document.addEventListener("deviceready", onDeviceReady, false);
//document.addEventListener('deviceready', startTest, false);

var month_names = new Array ( );
month_names[month_names.length] = "January";
month_names[month_names.length] = "February";
month_names[month_names.length] = "March";
month_names[month_names.length] = "April";
month_names[month_names.length] = "May";
month_names[month_names.length] = "June";
month_names[month_names.length] = "July";
month_names[month_names.length] = "August";
month_names[month_names.length] = "September";
month_names[month_names.length] = "October";
month_names[month_names.length] = "November";
month_names[month_names.length] = "December";

var day_names = new Array ( );
day_names[day_names.length] = "Sunday";
day_names[day_names.length] = "Monday";
day_names[day_names.length] = "Tuesday";
day_names[day_names.length] = "Wednesday";
day_names[day_names.length] = "Thursday";
day_names[day_names.length] = "Friday";
day_names[day_names.length] = "Saturday";



function onDeviceReady() {
//Check to see if we have a preference on how we show lists
		ImgCache.options.debug = true;
	ImgCache.options.usePersistentCache = true;

			ImgCache.init();
			
if (checkConnection() == "none")
{
	console.log("no shoe");
	$('#nointernet').css("visibility", "visible");
	$(".page").css("visibility", "hidden");
}
defaultlist = localStorage.getItem("list");
if (defaultlist == 1)
{
		document.getElementById('request_default').innerHTML = "List start w/ Recent"
}else{
		document.getElementById('request_default').innerHTML = "List start w/ All"

}
console.log("Default: "+defaultlist);

$('body').imagesLoaded(function($images, $proper, $broken ) {

				// see console output for debug info
				ImgCache.options.debug = true;
				ImgCache.options.usePersistentCache = true;
							//console.log("Length " + proper.length);

				ImgCache.init(function() {
					// 1. cache images
					for (var i = 0; i < $proper.length; i++) {
						ImgCache.cacheFile($($proper[i]).attr('src'));
					}
					// 2. broken images get replaced
					for (var i = 0; i < $broken.length; i++) {
						ImgCache.useCachedFile($($broken[i]));
					}

				});
			});
console.log($('body').html)
 }
							//	SETTING FUNCTIONS  ////
	

function setdefault()
{
	//Switch how lists are displayed and set a localstorage item
	if (defaultlist == 0)
	{
		defaultlist = 1;
		document.getElementById('request_default').innerHTML = "List start w/ Recent"
		localStorage.setItem("list", "1");

	}
	else
	{
		defaultlist = 0;
		document.getElementById('request_default').innerHTML = "List start w/ All"
		localStorage.setItem("list", "0");
	}
	
}

					////	FEEDBACK FUNCTIONS		////
	
function LoadSurvey()
{
	$('#surveys').empty();
	//Call the server to get the survey questions
	 $.ajax({
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getsurvey.php',
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	                var surveys = '<tr><td colspan="2">'+item.Question + '</td><td>&nbsp;<input id="' + item.id + '" type="checkbox"></td></tr>';
				    //As we loop we add to the tables        
					$('#surveys').append(surveys);	
					           
				});
				 var surveyopen= '<tr><td colspan="3"><br><br><b>Comments or Request New Game</b><br><textarea name="Name" rows="6" cols="30" id="text"></textarea></td></tr>';
				$('#surveys').append(surveyopen);
	        },
	        error: function(){
            console.log('There was an error loading the data.');
	        }  	
	});
}

function sendFeedback(i)
{
	

	var items = new Array();
	var i = 0;
		//Find all of the checkboxs marked and create a JSON for the server to eat
		$('input[type=checkbox]').each(function () {
    	var sThisVal = (this.checked ? "1" : "0");
    	sList = (sList=="" ? sThisVal : "," + sThisVal); //identify which ones are checked
			
    	if (sThisVal == "1") // if it is checked  then add to JSON string
    		{
    			jsonObj += '{ "id": "'+this.id +'", "value": "'+this.id+'" },';    
    			items[i] = this.id;
    			//alert(this.id);
    		}
    	 i++;
		});	
	jsonObj = jsonObj.slice(0, -1); //removes the training comma
	jsonObj += "]";

	//If someone leaves a comment lets capture it and sent it to the server 
	if($('#text').val().length > 1 )
		{
			$.ajax({
  		 	type: "POST",
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/addsurvey.php?t='+$('#text').val(),
	        success: function (data) {
            		        }
	       });   
		}
	//Give thanks for the feedback
	navigator.notification.confirm('Thanks for the Feedback!',  feedbackDismissed,  'Roger Roger',   'Acknowledge');

}
//Once feedback is given return to the homepage
function feedbackDismissed()
 {
 	openPage('root');
 }


		///		END FEEDBACK ITEMS		///

		///		Multi use functions		///

$('#save').click(function(){
	//The feedback and the save buttons are the same - but depending on what the button says will dictact where it goes
	if (this.innerHTML == "Send")
	{
		sendFeedback(this);
	}
	if (this.innerHTML == "Save")
	{
		saveaWin();
	}
});


$('#commongames').click(function(){

			$('#commongames').css("border-bottom", "9px solid #b73300");
			$('#allgames').css("border-bottom", "1px solid #b73300");
			$('#allgames').css("height", "40px");			
			$('#commongames').css("height", "31px");
			if(document.getElementById('title').innerHTML=="Choose Players")
			{	
				getUserFriends("common");
			}
			else{
				LoadGames("common");
			}
});

$('#allgames').click(function(){

			$('#allgames').css("border-bottom", "9px solid #b73300");
			$('#commongames').css("border-bottom", "1px solid #b73300");
			$('#allgames').css("height", "31px");			
			$('#commongames').css("height", "40px");
			console.log("In All games")
			if(document.getElementById('title').innerHTML=="Choose Players")
			{
				getUserFriends("all");
			}
			else{
			LoadGames("all");
			}
});


function transaction_error()
{
	
}

//LEADERBOARD STUFF
$(document).on("click","ul#StatSelection > li", function(){
	console.log(this.id);
   // navigator.notification.confirm($(this).text(),  onGameConfirm,  'Confirm Game',   'Confirm, Change');
    openPage('GamesStats', 1, this.id);

})


		///	GAME LIST PAGE	///
$(document).on("click","ul#ItemSelection > li", function(){
	 console.log($(this).text());
	 document.getElementById('gameid').innerHTML = this.id;
	 document.getElementById('gamename').innerHTML = $(this).text();
     navigator.notification.confirm($(this).text(),  onGameConfirm,  'Confirm Game',   'Confirm, Change');


})

function onGameConfirm(buttonIndex)
{
	console.log(buttonIndex);
	if (buttonIndex==2)
	{
		
	}
	else
	{
		openPage('players', 1, document.getElementById('gameid').innerHTML);
	} 
}


		///		PLAYER LIST PAGE FUNCTIONS		///


//If a user is marked as a winner I want to make sure that they are also a player
$("#PersonSelection").on('click', ':checkbox', function(){
	var other;
    //console.log("$('#PersonSelection').parent().html()");
    if (this.checked){
    	if(this.id.indexOf("s") !== -1 )
    	{
    		//console.log(this.id);
    		var n = this.id.split("s");
			other = "w" + n[1];
    		$("#"+other).attr('checked','checked');
    	}
    } else {
    }
});
  
function saveaWin()
{
console.log("Size when entering " + names.length);
	players.length = 0;
    names.length = 0;
    winnernames.length = 0;
    winners.length = 0;
	var sList = "";
	var j = 0;
	var id;
	console.log("Size after clearing" + names.length);
	
	i = 0; //test
	$('input[type=checkbox]').each(function () {
    	var sThisVal = (this.checked ? "1" : "0");
    	sList = (sList=="" ? sThisVal : "," + sThisVal);
			
    	if (sThisVal == "1") // if it is checked start tracking players
    		{
    			
    			id = this.id
    			var playerorwinner;
    			playerorwinner = id.charAt(0);
    		
    			if (playerorwinner == "w") //if the player played enter them here
    			{
    				var n = id.split("w");
    				players[i] =  n[1]; 		
    				console.log("Player: " + players[i]);
  					names[i] = this.parentNode.firstChild.innerHTML; //Capture the name of the person so we can display in the confirm pop up
    				console.log("Size: " + names.length);
    				i++;
    			}
    			
    			if (playerorwinner == "s")
    			{
    				var n = id.split("s");
    				winners[j] =  n[1]; 	
					console.log("Winner: " + winners[j]);
					winnernames[j] = this.parentNode.firstChild.innerHTML; //Capture the name of the person so we can display in the confirm pop up
    				j++;
    			}		
    		
    		}
    		
		});
		console.log("Size before confirm" + names.length);
		//Once we have the arrays then we need to confirm the players and the winners
	showConfirm(names, winnernames);		
}

//Confirm who the winners and losers are
function showConfirm(names, winnernames) 
{    
	
	playercheck = ""; //Clears out the text just in case the user needs to make adjustments
	var playercheck = "Players\n";
	for (var i=0; i<names.length; i++) {
		if (names[i] != "undefined")
			{
				console.log("name: " + names[i]);
				playercheck += names[i] +"\n";
			} 
		}
		
	playercheck +=  "\nWinner(s)\n";
	for (var i=0; i<winnernames.length; i++) {
		playercheck += winnernames[i] +"\n";
		}
		

	navigator.notification.confirm(playercheck,  onConfirm,  'Confirm Players',   'Confirm, Change');

}
//When a win has been logged come here and ask the user if they want to post to FB
function alertDismissed()
{
	var text1 = "";

for (var i=0; i< names.length; i++) 
	  {
	  	text1 += names[i] + "";
	  	if (i != names.length - 1)
	  		{
	  			text1 += " and ";
	  		}
	  }
	$('input:checkbox').removeAttr('checked');
	text1 += " just played " + document.getElementById('gamename').innerHTML + " , guess who won!";
	publishStory(text1); //Send to publish
    openPage('root');    //Go back to root
}                




function onConfirm(button) 
{   

	console.log("button: " +button);
	if (button == 2)
	{

	}else{
		
			InsertPlayer(players, Date(), winners);
	}
}

function InsertPlayer(players ,date, winners)
{
				var wl = 0;
				var id = getuserID();
				var g = document.getElementById('gameid').innerHTML;
				
				console.log(g + " gameid")
				//Loop through all of the players in the array which will hold everyone
				for (var i=0; i< players.length; i++) 
					{
						if (players[i] == winners[w]) //if the player and the winner match up lets give them credit 
							{
								jsonObj1 += '{ "owner": "'+ id +'", "game": "'+ g +'", "date": "'+date+'" , "player": "'+players[i]+'" , "wl": "1" },';    
								w++;  
							}
							else
							{
								jsonObj1 += '{ "owner": "'+ id +'", "game": "'+ g +'", "date": "'+date+'" , "player": "'+players[i]+'" , "wl": "0" },';    

							}
    			 		wl=0;
    			 }
		
				jsonObj1 = jsonObj1.slice(0, -1); //removes the training comma
				jsonObj1 += "]";		
				console.log(jsonObj1);		
		$.ajax({
  		 	 type: "POST",
  		 	data: { parameters: jsonObj1},
  		 	datatype: "json",
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/addround.php',
	        success: function (data) {
            // do stuff
			navigator.notification.confirm('Wins and Losses Recorded',  alertDismissed,  'Roger Roger',   'Acknowledge');

		        }
	       });			
	       		
}




// GAME PAGE FUNCTION

function LoadGames(common, gameid)
{
	

	 var numberplayed = 0;
	if (common == "common")
	{
			$('#commongames').css("border-bottom", "9px solid #b73300");
			$('#allgames').css("border-bottom", "1px solid #b73300");
			$('#allgames').css("height", "40px");			
			$('#commongames').css("height", "32px");
			
		$('.0').detach();
		 $.ajax({
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getgames.php?uid='+user.id+'&common=true',
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            	numberplayed ="0";
	            	img = "http://www.boardgameswithfriends.com/boardgamewinner/img/" + item.ShortName + ".png";
	            	ImgCache.cacheFile(img);
	                var games = '<li id= "' + item.id + '" class="'+numberplayed+'"><div>'+item.FullName+'</div><img src="'+img+'" data-desc="local_desc" class="list-icon">'+
	                				'<p class="buy"><img src="css/images/next.png"></p></li>';
				            console.log(games);
					$('#ItemSelection').append(games);	           
				});
	        },

	        error: function(){
            console.log('There was an error loading the data.');
	        }
	  	
	  });
	}
	else if (common == "stats")
	{
		
		 $.ajax({
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getgames.php?uid='+user.id+'&common=true',
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            	numberplayed ="0";
	                var games = '<li id= "' + item.id + '" class="'+numberplayed+'"><div>'+item.FullName+'</div><img src="http://www.boardgameswithfriends.com/boardgamewinner/img/' + item.ShortName + '.png" data-desc="local_desc" class="list-icon">'+
	                				'<p class="buy"><img src="css/images/next.png"></p></li>';
				            console.log(games);
					$('#StatSelection').append(games);	           
				});
	        },

	        error: function(){
            console.log('There was an error loading the data.');
	        }
	  	
	  });
		
		
	}
	else if (common == "datestimes")
	{
		var olddate = "";
		var star = "";
		$('#showplayers1').empty();
		console.log("http://www.boardgameswithfriends.com/boardgamewinner/datestimes.php?uid="+user.id+"&GameId="+gameid)
		 $.ajax({
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/datestimes.php?uid='+user.id+'&GameId='+gameid,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            	console.log(item.PlayerId);
	            		if (item.Winner==1)
	            			{
	            				star = "<img src='http://www.boardgameswithfriends.com/boardgamewinner/img/star.png' data-desc='local_desc'>";
	            			}
	            			else
	            			{
	            				star = "";
	            			}
	            		if (item.Date != olddate)
	            		{
	            			var d = new Date(item.Date);
	            			    var curr_date = d.getDay();
    							var curr_month = d.getMonth() + 1; //Months are zero based
    							var curr_year = d.getFullYear();
    							var curr_time = d.getHours();
    							var curr_min = d.getUTCMinutes();
								
							var dt = day_names[curr_date] + " " + month_names[curr_month] + " " + curr_date + " " + curr_year + "  " + curr_time + ":" + curr_min;
	            			$("#showplayers1").append('<tr><td colspan="2" style="padding-top:12px;margin:0px;" bgcolor="#B73300" align="center"><h1>'+dt+ '</h1></td></tr>');	
	            			$("#showplayers1").append('<tr><td colspan="2"><h1>'+findname(item.PlayerId)+ ''+ star+'</h1></td></tr>');

	            			olddate = item.Date;
	            		}
	            		else
	            		{
	            			
	            			$("#showplayers1").append('<tr><td colspan="2"><h1>'+findname(item.PlayerId)+ ''+ star+'</h1></td></tr>');
	            		}
	            	  
 
 					
			//		$('#showplayers').append(games);	           
				});
	        },

	        error: function(){
            console.log('There was an error loading the data.');
	        }
	  	
	  });
		
		
	}	
	else
	{
			$('#allgames').css("border-bottom", "9px solid #b73300");
			$('#commongames').css("border-bottom", "1px solid #b73300");
			$('#allgames').css("height", "31px");			
			$('#commongames').css("height", "40px");
		$('.0').detach();
	  $.ajax({
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getgames.php',
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            	numberplayed ="0";
	                var games = '<li id= "' + item.id + '" class="'+numberplayed+'"><div>'+item.FullName+'</div><img src="http://www.boardgameswithfriends.com/boardgamewinner/img/' + item.ShortName + '.png" data-desc="local_desc" class="list-icon">'+
	                				'<p class="buy"><img src="css/images/next.png"></p></li>';
				        //    console.log(games);
					$('#ItemSelection').append(games);	           
				});
	        },

	        error: function(){
            console.log('There was an error loading the data.');
	        }
	  	
	  });
	 }
}

//INDIVIDUAL GAME STATS

function showwins(gameid) //Pretty sure that this does not do anything
 {/*
 	
 	var len = results.rows.length;
 	var countwins = 0;
 	var countloses = 0;
 	var date = 0;
 	console.log("len: " + len);
 	
    //Place the names in the dropdown box
    for (var i=0; i<len; i++) {
    	if (results.rows.item(i).Winner == 1)
    		{
    			countwins++;
    		}
    	if (results.rows.item(i).Winner == 0)
    		{
    			countloses++;
    		}
    
      
    }
    var total = countwins + countloses;
    	console.log("win or lose: " + total);
 	$("#win"+results.rows.item(0).PlayerId).text(countwins);
 	$("#per"+results.rows.item(0).PlayerId).text(((countwins/total) * 100) + "%");
 	$("#total"+results.rows.item(0).PlayerId).text(total);
 	*/
 }
 
function showplayerinfo(result, id, callback)
{     
 			callback(id);	       
}


function LoadStats(id)
{
	var percent = "";
	
	DisplaySingleGame(id, user.id);
$('#showplayers').empty();
	var numofplays = 0;
	 $.ajax({
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getwinmatrix.php?owner='+user.id+'&GameId='+id,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	          
	             $("#showplayers").append('<tr><td colspan="2"><br><h1>'+findname(item.player)+ '</h1></td></tr>');
 				 $("#showplayers").append('<tr><td>Number of Wins:</td><td id="win'+item.player+'"></td></tr>');
 				 $("#showplayers").append('<tr><td>Win Percentage:</td><td id="per'+item.player+'"></td></tr>');
 				 $("#showplayers").append('<tr><td>Total Games:</td><td id="total'+item.player+'"></td></tr>');    
				percent = (parseFloat(item.win)/(parseFloat(item.win)+parseFloat(item.lose)) * 100);
	                $("#win"+item.player).text(item.win);
 					$("#per"+item.player).text(percent.toFixed(2) + "%");
 					$("#total"+item.player).text(parseFloat(item.win)+parseFloat(item.lose));
 			       
				});
	        },

	        error: function(){
            console.log('There was an error loading the data.');
	        }
	});
}
function DisplaySingleGame(id)
{

	  $("#StatSelection1 li").hide();

var Details = "Details";
	 $.ajax({

	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getgames.php?id='+id+'&uid='+user.id,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        async: true,
	        type: "POST",
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            	numberplayed ="0";
	                var games = '<li id= "' + item.id + '"><div>'+item.FullName+'</div><img src="http://www.boardgameswithfriends.com/boardgamewinner/img/' + item.ShortName + '.png" data-desc="local_desc" class="list-icon"><p class="buy" id="playednum">Played '+item.played+' Times<br><p class="buy1" id="details" onclick="openPage(\''+Details+'\',0,\''+item.id+'\')">Details</p></p></li>';
		      
					$('#StatSelection1').append(games);	
				});
	        },
	        error: function(){
            console.log('There was an error loading the data.');
	        }
	  })
//getPlays(user.id, id);
}

function getPlays(playerid, id)
{
		var text = "";
	console.log("p " + playerid);
	console.log("g " + id);
	
		$.ajax({
 				
	        url: 'http://www.boardgameswithfriends.com/boardgamewinner/getplaynumber.php?owner='+playerid+'&GameId='+id,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            		           text = "Played " + item.played + " times";
	            		           console.log("P: " + text);	
	           	 //$('#playednum').text("");
	  //
				});
	        },
	        error: function(){
	        	
            console.log('There was an error loading the data.');
	        getPlays(playerid, id);
	        }
		});


}
function findname(id)
{
	if (id == user.id)
	{
		return user.name
	}
	for (var i = 0; i < friends.length; i++) {
          if (friends[i].id == id) {
            //console.log(friends[i].name);
            return friends[i].name
          }
        }  
       
}
 	
function checkConnection() {
    var networkState = navigator.network.connection.type;
console.log("networl: " +networkState);
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    return networkState;
}
