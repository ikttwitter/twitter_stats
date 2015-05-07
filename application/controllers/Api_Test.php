<?php defined('BASEPATH') OR exit('No direct script access allowed');

require "vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

class Api_Test extends CI_Controller {

	public function index()
	{
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET);
		
		$url = "statuses/home_timeline";
		$params = array("count" => 25, "exclude_replies" => true);
		$object = $connection->get($url, $params);
		
		$data['json'] = json_encode($object);
		$this->load->view('Api_Test', $data);
	}
}
