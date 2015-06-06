$(document).ready(function() {
	searchTrendsLocations();
	createChart();
});

function showLoader() {
	$('.fakeloader').fakeLoader({
		bgColor : 'rgba(0,0,0,0.7)',
		zIndex : '9999999',
		spinner : 'spinner2'
	});
}

function hideLoader() {
	$('.fakeloader').fadeOut();
}

function isLimitExceeded(data) {
	if(data.errors && data.errors[0].code == 88) {
		hideLoader();
		window.location.replace(base_url + 'home/limitExceeded');
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
			
			if(type == 'searchByUser') {
				displayUser(data);
				//displayChartUser(data);
			}
			else if(type == 'searchByHashtag') {
				displayTweets(data);
			}
			else if(type == 'searchByLocation') {
				displayLocations(data);
			}
			else if(type == 'searchTrends') {
				displayTrends(data);
			}
			else if(type == 'userTimeline') {
				displayUserTimeline(data);
				//displayChart(data);
			}
			hideLoader();
		},
		error : function() {
			hideLoader();
			alert('There has been an error. Please try again later.');
		}
	});
}

function searchTrendsLocations() {
	var url, type;
	
	url = 'home/searchLocations/';
	type = 'searchByLocation';
	ajaxRequest(url, type);

}


function displayLocations(data) {
	var container, i, len, country, link;
	
	if(data.length == 0) {
		alert('No available locations!');
		return;
	}
	
	container = document.getElementById('trendDropdown');
	len = data.length;
	for(i = 0; i < len; i++) {
		
		if(data[i].placeType.name == 'Country') { 
			country = document.createElement('li');
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
		searchText = $('#txtSearch').val();
	
	//select list-group item and unselect other items
	$('.list-group-item').on('click',function(e){
		if(e.target.className !== 'list-group-item disabled'){
			var previous = $(this).closest('.list-group').children('.active');
			previous.removeClass('active');
			$(e.target).addClass('active');
		}	
	});
	
	$('#lblSearch').text(searchText);
	
	var url, type;
	
	if(searchText.charAt(0) == '@') { //Search user
		url = 'home/searchByUser/' + searchText.substring(1);
		type = 'searchByUser';
		
	}
	else if(searchText.charAt(0) == '#') { //Search hashtag
		url = 'home/searchByHashtag/' + searchText.substr(1);
		type = 'searchByHashtag';
		
	}
	else { //Search hashtag
		url = 'home/searchByHashtag/' + searchText;
		type = 'searchByHashtag';
	}
	
	ajaxRequest(url, type);
}

function searchTrends(woeid, country) {
	var container, trendHashtagPanelTitle, url, type;
	
	container = document.getElementById('trends');
	container.innerHTML = '';
	trendHashtagPanelTitle = document.createElement('a');
	trendHashtagPanelTitle.className = 'list-group-item disabled';
	trendHashtagPanelTitle.innerHTML = 'Trends in' + ' ' + country;
	container.appendChild(trendHashtagPanelTitle);
	
	url = 'home/topHashtags/' + woeid;
	type = 'searchTrends';
	ajaxRequest(url, type);
	
	
}

function displayTrends(data) {
	var container, i, len, trendHashtagPanel;
	
	if(data.length == 0) {
		alert('No available trends!');
		return;
	}
	container = document.getElementById('trends');
	len = data[0].trends.length;
	for(i = 0; i < len; i++) {
		trendHashtagPanel = document.createElement('a');
		trendHashtagPanel.className = 'list-group-item';
		trendHashtagPanel.id = i;
		trendHashtagPanel.innerHTML = data[0].trends[i].name;
		trendHashtagPanel.dataset.name = data[0].trends[i].name;
		trendHashtagPanel.setAttribute('href', '#');
		trendHashtagPanel.setAttribute('onClick', 'searchTwitter(this, this.dataset.name)');
		container.appendChild(trendHashtagPanel);	
	}
}

function displayUser(data) {
	var container, i, len,
	userPanel, header, name, body, img,
	status, footer, following, followers;
	
	if(data.length == 0) {
		alert('NO USER!');
		return;
	}
	container = document.getElementById('panel');
	document.getElementById('panel').innerHTML = '';
	len = data.length;	
	
	for(i = 0; i < len; i++ ) {
	
		//create panel for user content
		userPanel = document.createElement('div');
		userPanel.className = 'panel panel-primary';
		userPanel.style.maxWidth = '700px';
		userPanel.style.margin = '0 auto';
		userPanel.style.marginTop = '10px';
		userPanel.dataset.name = data[i].screen_name;
		userPanel.setAttribute('href', '#');
		userPanel.setAttribute('onClick', 'searchUserTimeline(this.dataset.name)');
		userPanel.style.cursor = 'pointer';
		
		//create panel header 
		header = document.createElement('div');
		header.className = 'panel-heading';
		userPanel.appendChild(header);
		//append user screen name to header
		name = document.createElement('H3');
		name.className = 'panel-title';
		if(typeof data[i].screen_name !== 'undefined' && data[i].screen_name !== null) {
			name.innerHTML = '@'+data[i].screen_name;
		}
		header.appendChild(name);
		//create panel body
		body = document.createElement('div');
		body.className = 'panel-body';
		if(typeof data[i].profile_background_image_url !== 'undefined' && data[i].profile_background_image_url !== null) {
			body.style.backgroundImage = "url('"+data[i].profile_background_image_url+"')";
		}
		userPanel.appendChild(body);
		//create and add profile picture to body
		img = document.createElement('IMG');
		if(typeof data[i].profile_image_url !== 'undefined' && data[i].profile_image_url !== null){
			img.src = data[i].profile_image_url.replace('_normal', '_bigger');
		}
		img.style.border = 'thin solid black';
		img.style.borderRadius = '10px';
		body.appendChild(img);
		
		//add status to body
		status = document.createElement('H5');
		status.style.backgroundColor = 'white';
		status.style.borderRadius = '10px';
		status.style.padding = '10px';
		status.style.opacity = '0.9';
		if(typeof data[i].status !== 'undefined' && data[i].status !== null) {
			status.innerHTML = data[i].status.text;
		}
		status.style.cssFloat = 'right';
		body.appendChild(status);
		
		//footer
		footer = document.createElement('div');
		footer.className = 'panel-footer';
		userPanel.appendChild(footer);
		followers = document.createElement('H4');
		followers.innerHTML = 'Followers:'+data[i].followers_count;
		following = document.createElement('H4');
		following.innerHTML = 'Following:'+data[i].friends_count;
		footer.appendChild(followers);
		footer.appendChild(following);
		
		container.appendChild(userPanel);	
		
	}
}

function searchUserTimeline(screenName){
	var url, type;
	console.log(screenName);
	url = 'home/userTimeline/' + screenName;
	type = 'userTimeline';
	ajaxRequest(url, type);
} 

function displayUserTimeline(data) {
	var sumFavourites = 0,
	sumRetweets = 0,
	numberOfTweets = 0,
	numberOfFollowers,
	numberOfFriends,
	favouritesCount,
	tweetsCount,
	maxRTweet = 0,
	maxFTweet = 0,
	maxTweetRt,
	maxTweetFv;
	
	if(data.length == 0) {
		alert('NO USER!');
		return;
	}	
	
	numberOfFollowers = data[0].user.followers_count;
	numberOfFriends = data[0].user.friends_count;
	favouritesCount = data[0].user.favourites_count;
	tweetsCount = data[0].user.statuses_count;
	numberOfTweets = data.length;
	document.getElementById('panel').innerHTML = '';
	//data.statuses.forEach(function(tweet) {
	data.forEach(function(tweet) {
		sumRetweets += tweet.retweet_count;
		sumFavourites += tweet.favorite_count;
		if(tweet.retweet_count > maxRTweet) {
			maxRTweet = tweet.retweet_count;
			maxTweetRt = tweet.id;
		}
		if(tweet.favorite_count > maxRTweet) {
			maxFTweet = tweet.favorite_count;
			maxTweetFv = tweet.id;
		}	
		
			displayTweet(tweet.id);
		});
	
	container = document.getElementById('statistics');
	document.getElementById('statistics').innerHTML = '';
	
	
	//table1
	var containerT1, table, head, body, title;
	
	containerT1 = document.createElement('div'); 
	containerT1.className = 'container';
	title = document.createElement('h2');
	title.innerHTML = 'Информации за корисникот' + ' ' + '@' + data[0].user.screen_name;
	containerT1.appendChild(title);
	table = document.createElement('table');
	table.className = 'table table-bordered'
	head = table.createTHead();
	var row = head.insertRow(0);
	var cell1 = document.createElement('th');
	row.appendChild(cell1);
    var cell2 = document.createElement('th');
	row.appendChild(cell2);
	var cell3 = document.createElement('th');
	row.appendChild(cell3);
	var cell4 = document.createElement('th');
	row.appendChild(cell4);
    cell1.innerHTML = "Followers";
    cell2.innerHTML = "Following";
	cell3.innerHTML = "Favorites";
	cell4.innerHTML = "Tweets";
	body = table.createTBody();
	var row = body.insertRow(0);
	var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
    cell1.innerHTML = numberOfFollowers;
    cell2.innerHTML = numberOfFriends;
	cell3.innerHTML = favouritesCount;
	cell4.innerHTML = tweetsCount;
	containerT1.appendChild(table);
	container.appendChild(containerT1);
	
	//table2
	var containerT2, table, head, body, title;
	
	containerT2 = document.createElement('div'); 
	containerT2.className = 'container';
	title = document.createElement('h2');
	title.innerHTML = 'Статистика за последните 10 дена';
	containerT2.appendChild(title);
	table = document.createElement('table');
	table.className = 'table table-bordered'
	head = table.createTHead();
	var row = head.insertRow(0);
	var cell1 = document.createElement('th');
	row.appendChild(cell1);
    var cell2 = document.createElement('th');
	row.appendChild(cell2);
	var cell3 = document.createElement('th');
	row.appendChild(cell3);
    cell1.innerHTML = "Број на твитови";
    cell2.innerHTML = "Вкупен број на retweets";
	cell3.innerHTML = "Вкупен број на favourites";
	body = table.createTBody();
	var row = body.insertRow(0);
	var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
    cell1.innerHTML = numberOfTweets;
    cell2.innerHTML = sumRetweets;
	cell3.innerHTML = sumFavourites;
	
	containerT2.appendChild(table);
	container.appendChild(containerT2);
	
	//najretvitnat tweet
	var containerRt;
	containerRt = document.createElement('div'); 
	containerRt.className = 'container';
	containerRt.id = 'containerRt';
	title = document.createElement('h2');
	title.innerHTML = 'Нај ретвитнат твит во последните 10 дена';
	container.appendChild(title);
	container.appendChild(containerRt);
	displayTweetRt(maxTweetRt);
	
	//najfejvnat tweet
	var containerFv;
	containerFv = document.createElement('div'); 
	containerFv.className = 'container';
	containerFv.id = 'containerFv';
	title = document.createElement('h2');
	title.innerHTML = 'Нај фејвнат твит во последните 10 дена';
	container.appendChild(title);
	container.appendChild(containerFv);
	displayTweetFv(maxTweetFv);
}

function displayTweets(data) {
	if(data.length == 0) {
		alert('NO TWEETS!');
		return;
	}
	document.getElementById('panel').innerHTML = '';
	//data.statuses.forEach(function(tweet) {
	data.forEach(function(tweet) {
		console.log(tweet.created_at);
		displayTweet(tweet.id);
		});
}



function displayTweet(id) {
	twttr.widgets.createTweet(id,
			document.getElementById('panel'), {
				align : 'center'
			}).then(function(el) {
		console.log('@evs Tweet has been displayed.')
	});
}

function displayTweetRt(id) {
	twttr.widgets.createTweet(id,
			document.getElementById('containerRt'), {
				align : 'center'
			}).then(function(el) {
		console.log('@evs Tweet has been displayed.')
	});
}

function displayTweetFv(id) {
	twttr.widgets.createTweet(id,
			document.getElementById('containerFv'), {
				align : 'center'
			}).then(function(el) {
		console.log('@evs Tweet has been displayed.')
	});
}

function createChart(){

var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

	//var ctx = document.getElementById("myChart").getContext("2d");
	//var myNewChart = new Chart(ctx).Line(data);
	
}











