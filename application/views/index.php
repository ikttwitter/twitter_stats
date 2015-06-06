<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title><?php echo $title; ?></title>

        <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js" ></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
        <script type="text/javascript" src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
        <link rel="stylesheet" type="text/css" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css"  />
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Raleway" />
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Poiret+One" />
        <link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" />
		<script type="text/javascript" src="assets/js/Chart/Chart.js" ></script>
		

        <?php
	        if (isset($scripts)) {
	            foreach ($scripts as $script) {
	                echo '<script type="text/javascript" src="' . base_url() . 'assets/js/' . $script . '" ></script>';
	            }
	        }
        ?>
        
        <?php
	        if (isset($styles)) {
	            foreach ($styles as $style) {
	                echo '<link type="text/css" rel="stylesheet" href="' . base_url() . 'assets/css/' . $style . '" />';
	            }
	        }
        ?> 
        
        <script>
			  window.twttr = (function (d,s,id) {
		      var t, js, fjs = d.getElementsByTagName(s)[0];
		      if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
		      js.src="https://platform.twitter.com/widgets.js";
		      fjs.parentNode.insertBefore(js, fjs);
		      return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
		  }(document, "script", "twitter-wjs"));
		</script>
        <script>
            var base_url = '<?php echo base_url(); ?>';	
        </script>
        
    </head>

    <body style="padding-top: 70px;">
        <div id="twitter-wjs"></div>
        <div class="fakeloader"></div>
        
	    <nav id="navbar" class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse"
						data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
					
					<form class="navbar-form navbar-left" role="search">
						<div class="form-group">
							<input id="txtSearch" type="text" class="form-control"
								placeholder="Enter #hashtag or @user ...">
						
						</div>
						<button id="btnSearch" onClick="searchTwitter(); return false;" type="submit"
							class="btn btn-default">Search</button>
					</form>
				</div>
			</div>
		</nav>
		
        <div class="container">
			<div class="row">
				<div class="col-md-3">
					<p class="lead">Most popular hashtags</p>
					<div class="dropdown" style="margin-bottom:10px;" >
						<button id="btnTrendsLocation" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">
							Trends by location
							<span class="caret"></span>
						</button>
						<ul id="trendDropdown" class="dropdown-menu scrollable-menu" style="height:auto; max-height: 200px; overflow-x: hidden;"  role="menu">
						</ul>
					</div>
					<div id="trends" class="list-group menu" role="menu">
					</div>
				</div>
					<p class="lead">You are searching for 
						<span id="lblSearch"></span>
					</p>
				<div id="panel" class="col-md-9" style="height:auto; max-height: 800px; overflow-x: hidden; border-top:thin solid black; padding:10px;">
				</div>
				<div id="statistics" class="col-md-12" style="height:auto; border-top:thin solid black; padding:10px;">
					<!-- <canvas class ="'panel panel-primary'" id="myChart" width="400" height="400" style="max-width = 700px; margin:0 auto;"></canvas> -->
					
					
				</div>
			</div>
		</div>
		
    </body>

</html>