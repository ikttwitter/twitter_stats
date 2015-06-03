$(document).ready(function() {
	searchTrendsLocations();
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
			
			isLimitExceeded(data);
			
			if(type == "searchByUser") {
				displayUser(data);
			}
			else if(type == "searchByHashtag") {
				displayTweets(data);
			}
			else if(type == "searchByLocation") {
				
				displayLocations(data);
			}
			else if(type == "searchTrends"){
			
				displayTrends(data);
			}
			hideLoader();
		},
		error : function() {
			hideLoader();
			alert("There has been an error. Please try again later.");
		}
	});
}

function searchTrendsLocations() {
	
	var url, type;
	
	url = "home/searchLocations/";
	type = 'searchByLocation';
	ajaxRequest(url, type);

}


function displayLocations(data) {
	var container, i;
	
	if(data.length == 0) {
		alert("No available locations!");
		return;
	}
	
	container = document.getElementById("trendDropdown");
	
	for(i = 0; i<data.length; i++){
		if(data[i].placeType.name == 'Country'){
			var country, link;
			country = document.createElement("li");
			link = document.createElement('a');
			link.dataset.woeid = data[i].woeid;
			link.dataset.country = data[i].name;
			link.innerHTML = data[i].name;
			link.setAttribute('href', '#');
			link.setAttribute('onClick', 'searchTrends(this.dataset.woeid, this.dataset.country)');
			country.appendChild(link);
			container.appendChild(country);
		}
	}
}



function searchTwitter(target, searchText) {
	if(!searchText)
		searchText = $("#txtSearch").val();
	else{
		$(".popularHashtag").removeClass('active');
		$(target).addClass('active');
	}
	
	//select list-group item and unselect other items
	$('.list-group-item').on('click',function(e){
		var previous = $(this).closest(".list-group").children(".active");
		previous.removeClass('active');
		$(e.target).addClass('active');
	});
	
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

function searchTrends(woeid, country){
	
	var container, trendHashtagPanelTitle, url, type;
	
	container = document.getElementById("trends");
	container.innerHTML = "";
	trendHashtagPanelTitle = document.createElement('a');
	trendHashtagPanelTitle.className = 'list-group-item disabled';
	trendHashtagPanelTitle.innerHTML = "Trends in" + " " + country;
	container.appendChild(trendHashtagPanelTitle);
	
	url = "home/topHashtags/" + woeid;
	type = 'searchTrends';
	ajaxRequest(url, type);
	
	
}

function displayTrends(data) {
	var container, i;
	
	if(data.length == 0) {
		alert("No available trends!");
		return;
	}
	container = document.getElementById("trends");
	
	for(i = 0; i<data[0].trends.length; i++){
		var trendHashtagPanel = document.createElement('a');
		trendHashtagPanel.className = 'list-group-item';
		trendHashtagPanel.innerHTML = data[0].trends[i].name;
		trendHashtagPanel.dataset.name = data[0].trends[i].name;
		trendHashtagPanel.setAttribute('href', '#');
		trendHashtagPanel.setAttribute('onClick', 'searchTwitter(this, this.dataset.name)');
		container.appendChild(trendHashtagPanel);
	}
}

function displayUser(data) {
	var container, i;
	
	if(data.length == 0) {
		alert("NO USER!");
		return;
	}
	container = document.getElementById("panel");
	$('#panel').empty();
		
	for(i=0; i < data.length; i++ ){
	
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
		if(typeof data[i].screen_name !== "undefined" && data[i].screen_name !== null){
		
			name.innerHTML = "@"+data[i].screen_name;
		}
		header.appendChild(name);
		//create panel body
		var body = document.createElement("div");
		body.className = 'panel-body';
		if(typeof data[i].profile_background_image_url !== "undefined" && data[i].profile_background_image_url !== null){
		
			body.style.backgroundImage = "url('"+data[i].profile_background_image_url+"')";
		}
		userPanel.appendChild(body);
		//create and add profile picture to body
		var img = document.createElement("IMG");
		if(typeof data[i].profile_image_url !== "undefined" && data[i].profile_image_url !== null){
		
			img.src = data[i].profile_image_url.replace("_normal", "_bigger");
		}
		img.style.border = "thin solid black";
		img.style.borderRadius = "10px";
		body.appendChild(img);
		
		//add status to body
		var status = document.createElement("H5");
		status.style.backgroundColor = "white";
		status.style.borderRadius = "10px";
		status.style.padding = "10px";
		status.style.opacity = "0.9";
		if(typeof data[i].status !== "undefined" && data[i].status !== null){
		
			status.innerHTML = data[i].status.text;
		}
		status.style.cssFloat = "right";
		body.appendChild(status);
		
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
	$('#panel').empty();
	data.statuses.forEach(function(tweet) {
		displayTweet(tweet.id);
	});
}

function displayTweet(id) {
	twttr.widgets.createTweet(id,
			document.getElementById("panel"), {
				align : 'center'
			}).then(function(el) {
		console.log("@ev's Tweet has been displayed.")
	});
}