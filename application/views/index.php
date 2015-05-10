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
            var base_url = '<?php echo base_url(); ?>';
        </script>
    </head>

    <body>
        <div class="fakeloader"></div>
    	<input id="txtSearch" type="text" placeholder="Enter hashtag"></input>
    	<button id="btnSearch" onClick="searchByHastag();">Search</button>
    	<div id="results"></div> 
    </body>

</html>