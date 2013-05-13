//
// Graph API
// See https://developers.facebook.com/docs/reference/api/
//
//////////////////////////

//Detect when Facebook tells us that the user's session has been returned
function updateAuthElements() {
  FB.Event.subscribe('auth.statusChange', function(session) {
    if (session.authResponse) { 
      //The user is logged in, so let's pre-fetch some data and check the current 
      //permissions to show/hide the proper elements.
      preFetchData();
      checkUserPermissions();
    }
  });
}

//Get the user's basic information
function getUserBasicInfo() {
  setAction('Getting your information', false);
  
  var markup = '<div class="data-header">Your information:</div>';
  
  //Update display of user name and picture
  if (document.getElementById('user-info')) {
    var profilePictureUrl = '';
    if (user.picture.data) {
      profilePictureUrl = user.picture.data.url;
    } else {
      profilePictureUrl = user.picture;
    }
    markup = markup + '<strong>User ID:</strong> ' + user.id + '<br />' + '<strong>Name:</strong> ' + user.name + '<br />' + '<strong>Profile picture URL:</strong> <a href="' + profilePictureUrl + '" target="_blank">' + profilePictureUrl + '</a><br />';
    document.getElementById('user-info').innerHTML = markup;
    //return user.id;
   clearAction();
  }
}

function getuserID()
{
	return user.id;
	
}
//Get the user's friends
function getUserFriends(common) {

console.log("In GetUserFriends: "+ common); 
if(common=="common")
{
			$('#commongames').css("border-bottom", "9px solid #b73300");
			$('#allgames').css("border-bottom", "1px solid #b73300");
			$('#allgames').css("height", "40px");			
			$('#commongames').css("height", "32px");
	
	
	  $("#PersonSelection li").hide();

	 $.ajax({
	        url: 'http://50.112.117.245/getrecentplayers.php?id='+user.id,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 5000,
	        success: function(data, status){
	            $.each(data, function(i,item){
	            	console.log(item.PlayerId); 
	            	$('#'+item.PlayerId).show();
	   
	            	numberplayed ="0";    
				});
	        },

	        error: function(){
            console.log('There was an error loading the data.');
	        }
	  	
	  });
	
	
}
else{

	$('#allgames').css("border-bottom", "9px solid #b73300");
	$('#commongames').css("border-bottom", "1px solid #b73300");
	$('#allgames').css("height", "32px");			
	$('#commongames').css("height", "40px");
			
	var markup ='<li id="' + user.id + '" class="liclass"><div id="FBname">'+user.name+'</div><img style="align:left;" data-desc="local_desc" class="list-icon" src="' + user.picture.data.url + '"><br><br><input type="checkbox" id="w'+ user.id + '" class="markedplayer"><input type="checkbox" id="s'+user.id+'"  class="markedwinner"></li>';
	console.log("size: " + $("#PersonSelection li").size())
	if ($("#PersonSelection li").size() > 3)
	{
	   $("#PersonSelection li").show();

	} else {
  		for (var i=0; i < friendsInfo.length && i < 1000; i++) {
	    	var profilePictureUrl = '';
    		if (friendsInfo[i].picture.data) {
	    	  	profilePictureUrl = friendsInfo[i].picture.data.url;
    		} else {
	    	  profilePictureUrl = friendsInfo[i].picture;
    		}
   
	    markup += '<li id="'+friendIDs[i]+'" class="liclass"><div id="FBname">' + friendsInfo[i].name +'</div><img data-desc="local_desc" class="list-icon" src="' + profilePictureUrl + '"><br><br><input type="checkbox" id="w' + friendIDs[i] +'" class="markedplayer"><input type="checkbox" id="s' + friendIDs[i] + '" class="markedwinner"></label></li>';
 
  		}
  	document.getElementById('PersonSelection').innerHTML += markup;
  
    }
  
  }
  
  
// console.log( document.getElementById('page-players').innerHTML);
}

//Get the user's check-ins
function getCheckIns() {
  setAction('Getting check-ins', false);
  
  FB.api('/me/checkins', function(response) {
    console.log('Got your check-ins: ', response);
    
    clearAction();
    
    if (!response.error) {
      displayCheckIns(response.data, document.getElementById('checkins'));
    }
  });
}

//Display the user's check-ins
function displayCheckIns(checkins, dom) {
  var markup = '<div class="data-header">Your last five check-ins:</div>';
  
  for (var i=0; i < checkins.length && i < 5; i++) {
    var checkin = checkins[i];
    
    markup += '<div class="place">'
        + '<div class="picture"><img src="http://graph.facebook.com/' + checkin.place.id + '/picture"></div>'
        + '<div class="info">'
        + '  <div class="name">' + checkin.place.name + '</div>'
        + '  <div class="check-in-msg">' + (checkin.message || '') + '</div>'
        + '</div>'
      + '</div>';
  }
  
  dom.innerHTML = markup;
}

//Display the local places that the user can check into
function displayPlaces(places, dom) {
  var markup = '<div class="data-header">Nearby locations:</div>';
  
  for (var i=0; i < places.length && i < 5; i++) {
    var place = places[i];
    
    markup += '<div class="place">'
        + '<div class="picture"><img src="http://graph.facebook.com/' + place.id + '/picture"></div>'
        + '<div class="info">'
        + '  <div class="name">' + place.name + '</div>'
        + '  <div class="check-in-button"><input type="button" value="Check in" onclick="checkin(' + place.id + ')" /></div>'
        + '</div>'
      + '</div>';
  }
  
  dom.innerHTML = markup;
}

//Check the user into the place
function checkin(id) {
  setAction("Checking you in", false);
  
  var params = {
    method: 'POST',
    place: id,
    coordinates: {
      latitude: curLocation.coords.latitude,
      longitude: curLocation.coords.longitude
    },
    message: ''
  };

  console.log('Checking you into using the following params: ', params);
  
  FB.api('/me/checkins', params,
    function(response) {
      clearAction();
      
      console.log('Checked you into the place, here\'s the response: ', response);
      
      setAction("You've successfully checked in!", false);
      
      setTimeout('clearAction();', 2000);
    }
  );
}

//Get locations near the user
function getNearby() {
  setAction("Getting nearby locations", false);
  
  // First use browser's geolocation API to obtain location
  navigator.geolocation.getCurrentPosition(function(location) {
    curLocation = location;
    console.log(location);

    // Use graph API to search nearby places
    var path = '/search?type=place&center=' + location.coords.latitude + ',' + location.coords.longitude + '&distance=1000';
    
    FB.api(path, function(response) {
      clearAction();
      console.log('Got some places near you: ', response);
      if (!response.error) {
        displayPlaces(response.data, document.getElementById('locations-nearby'));
      }
    });
  });
}

//Pre-fetch data, mainly used for requests and feed publish dialog
var nonAppFriendIDs = [];
var appFriendIDs = [];
var friendIDs = [];
var friendsInfo = [];

function sortByName(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function preFetchData() {
  //First, get friends that are using the app
  FB.api({method: 'friends.getAppUsers'}, function(appFriendResponse) {
    appFriendIDs = appFriendResponse;
  
    //Now fetch all of the user's friends so that we can determine who hasn't used the app yet
    FB.api('/me/friends', { fields: 'id, name, picture' }, function(friendResponse) {
      friends = friendResponse.data.sort(sortByName);
      
      //limit to a 200 friends so it's fast
      for (var k = 0; k < friends.length && k < 1000; k++) {
      
        var friend = friends[k];
        var index = 1;
        
        friendIDs[k] = friend.id;
        
        friendsInfo[k] = friend;
        
        for (var i = 0; i < appFriendIDs.length; i++) {
          if (appFriendIDs[i] == friend.id) {
            index = -1;
          }
        }       
        
        if (index == 1) { 
          nonAppFriendIDs.push(friend.id);
        }
      }
      
      console.log('Got your friend\'s that use the app: ', appFriendIDs);
      
      console.log('Got all of your friends: ', friendIDs);
      
      console.log('Got friends that are not using the app yet: ', nonAppFriendIDs);
    });
  });
}