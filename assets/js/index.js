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

function ajaxRequest(url) {
	console.log(base_url + url);
	showLoader();
	$.ajax({
		url : base_url + url,
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			hideLoader();
			if(data.statuses.length == 0)
				alert("NO TWEETS!");
			displayTweets('tweets', data);
			console.log(JSON.stringify(data));
		},
		error : function() {
			hideLoader();
			alert("There has been an error. Please try again later.");
		}
	});
}

function searchByHastag() {
	var hashTag = $("#txtSearch").val();
	var url = "home/searchByHashtag/" + hashTag;
	ajaxRequest(url);
}

function displayTweet(container, id) {
	twttr.widgets.createTweet(id,
			document.getElementById(container), {
				align : 'left'
			}).then(function(el) {
		console.log("@ev's Tweet has been displayed.")
	});
}

function displayTweets(container, data) {
	$('#' + container).empty();
	data.statuses.forEach(function(tweet) {
		displayTweet(container, tweet.id);
	});
}