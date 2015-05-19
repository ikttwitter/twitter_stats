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

function ajaxRequest(url, type) {
	console.log(base_url + url);
	showLoader();
	$.ajax({
		url : base_url + url,
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			console.log(JSON.stringify(data));
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