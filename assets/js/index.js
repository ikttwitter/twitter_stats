$(document).ready(function() {
	searchTwitter(this, $("#lblSearch").text());
});

function showLoader() {
	$(".fakeloader").fakeLoader({
		bgColor : "rgba(0,0,0,0.7)",
		zIndex : "9999999",
		spinner : "spinner2"
	});
}

function hideLoader() {
	$(".fakeloader").fadeOut();
}

function isLimitExceeded(data) {
	if(data.errors && data.errors[0].code == 88) {
		hideLoader();
		window.location.replace(base_url + "home/limitExceeded");
	}
}

function ajaxRequest(url, type) {
	console.log(base_url + url);
	showLoader();
	$.ajax({
		url : base_url + url,
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			//console.log(JSON.stringify(data));
			isLimitExceeded(data);
			
			if(type == "searchByUser") {
				displayUser(data);
			}
			else if(type == "searchByHashtag") {
				displayTweets(data);
			}
			hideLoader();
		},
		error : function() {
			hideLoader();
			alert("There has been an error. Please try again later.");
		}
	});
}

function searchTwitter(target, searchText) {
	if(!searchText)
		searchText = $("#txtSearch").val();
	else{
		$(".popularHashtag").removeClass('active');
		$(target).addClass('active');
	}
	$("#lblSearch").text(searchText);
	
	var url, type;
	
	if(searchText.charAt(0) == '@') { //Search user
		url = "home/searchByUser/" + searchText.substring(1);
		type = 'searchByUser';
	}
	else if(searchText.charAt(0) == '#') { //Search hashtag
		url = "home/searchByHashtag/" + searchText.substring(1);
		type = 'searchByHashtag';
	}
	else { //Search hashtag
		url = "home/searchByHashtag/" + searchText;
		type = 'searchByHashtag';
	}
	
	ajaxRequest(url, type);
}

function displayUser(data) {
	if(data.length == 0) {
		alert("NO USER!");
		return;
	}
		var container = document.getElementById("panel");
		container.innerHTML = "";
		for( i=0 ; i < data.length ; i++ )
		{	
			//create panel for user content
			var userPanel = document.createElement("div");
			userPanel.className = 'panel panel-primary';
			//create panel header 
			var header = document.createElement("div");
			header.className = 'panel-heading';
			userPanel.appendChild(header);
			//append user screen name to header
			var name = document.createElement("H3");
			name.className = 'panel-title';
			header.appendChild(name);
			name.innerHTML = "@"+data[i].screen_name;
			//create panel body
			var body = document.createElement("div");
			body.className = 'panel-body';
			body.style.backgroundImage = "url('"+data[i].profile_background_image_url+"')";
			userPanel.appendChild(body);
			//create and add profile picture to body
			var img = document.createElement("IMG");
			img.src = data[i].profile_image_url.replace("_normal", "_bigger");
			img.style.border = "thin solid black";
			img.style.borderRadius = "10px";
			body.appendChild(img);
			
			//add status to body
			/*var status = document.createElement("H3");
			status.style.backgroundColor = "white";
			status.style.borderRadius = "10px";
			status.style.padding = "10px";
			status.style.opacity = "0.9";
			if(data[i].status.text != null)
				status.innerHTML = data[i].status.text;
			status.style.cssFloat = "right";
			body.appendChild(status);*/
			
			//footer
			var footer = document.createElement("div");
			footer.className = 'panel-footer';
			userPanel.appendChild(footer);
			var followers = document.createElement("H4");
			followers.innerHTML = "Followers:"+data[i].followers_count;
			var following = document.createElement("H4");
			following.innerHTML = "Following:"+data[i].friends_count;
			footer.appendChild(followers);
			footer.appendChild(following);
			container.appendChild(userPanel);	
			
		}
}

function displayTweets(data) {
	if(data.statuses.length == 0) {
		alert("NO TWEETS!");
		return;
	}
	$('#tweets').empty();
	data.statuses.forEach(function(tweet) {
		displayTweet(tweet.id);
	});
}

function displayTweet(id) {
	twttr.widgets.createTweet(id,
			document.getElementById("tweets"), {
				align : 'center'
			}).then(function(el) {
		console.log("@ev's Tweet has been displayed.")
	});
}