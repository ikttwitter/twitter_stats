
	function showLoader() {
        $(".fakeloader").fakeLoader({
            bgColor: "rgba(0,0,0,0.7)",
			zIndex:"9999999",
            spinner: "spinner2"
        });
    }

    function hideLoader() {
        $(".fakeloader").fadeOut();
    }
    
	function ajaxRequest(url) {
		console.log(base_url + url);
		showLoader();
		$.ajax({
			url: base_url + url,
			type: 'GET',
			dataType: 'json',
			success: function (data) {
				hideLoader();
				$("#results").html(JSON.stringify(data));
			},
			error: function () {
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