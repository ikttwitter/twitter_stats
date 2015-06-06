<?php defined('BASEPATH') OR exit('No direct script access allowed');

require 'vendor/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

class Home extends CI_Controller {

	private $connection;
	
	function __construct() {
		parent::__construct();
		$this->connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET);
	}
	
	public function index()
	{
		$title = 'TWITTER STATS';
		$scripts = array(
			'index.js',
			'fakeLoader.js'		
		);
		$styles = array(
			'fakeLoader.css'		
		);
		
		$data = array(
			'title' => $title,
			'scripts' => $scripts,
			'styles' => $styles,
		);
		
		$this->load->view('index', $data);
	}
	
	public function searchByHashtag($hashtag) {
		//$id = null;
		$url = "search/tweets";
		$params = array(
		"q" => $hashtag,
		"result_type" => "recent",		
		"count" => 10, );
		$object = $this->connection->get($url, $params);
		$array1 = $object->statuses;
		$id = end($array1)->id;
		$object2 = $this->connection->get($url, array("q" => $hashtag,"result_type" => "recent", "count" => 100,"max_id" => $id,));
		$array2 = $object2->statuses;
		$array = array_merge($array1,$array2);
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($array));
		}
		else {
			return $object;
		}
	}
	
	public function topHashtags($woeid) {
		
		$url = 'trends/place';
		$params = array('id' => $woeid);
		$object = $this->connection->get($url, $params);
		
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($object));
		}
		else {
			return $object;
		}
	}
	
	public function searchLocations() {
		
		$url = 'trends/available';
		$params = array('id' => '1');
		$object = $this->connection->get($url, $params);
		
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($object));
		}
		else {
			return $object;
		}
	}
	
	public function searchByUser($user) {

		$url = 'users/search';
		$params = array('q' => $user, 'count' => 100);
		$object = $this->connection->get($url, $params);
		
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($object));
		}
		else {
			return $object;
		}
	}
	
		
	public function userTimeline($screenName) {
		date_default_timezone_set("UTC");
		$now = time(); // or your date as well
		

		$url = 'statuses/user_timeline';
		$params = array('screen_name' => $screenName, 'count' => 200, 'exclude_replies' => true, 'include_rts' => false,);
		$object1 = $this->connection->get($url, $params);
		
		if(count($object1) < 200) {
			
			foreach($object1 as $key => $value) {
				$twitter_date = strtotime($value->created_at);
				$datediff = $now - $twitter_date;
				$hour_diff = floor($datediff/(60*60));
				if($hour_diff > 240) {
					
					unset($object1 [$key]);
				}
			
			}
			
		}
		
		else if(count($object1) > 200){
			$id = end($object1)->id ;
			$object2 = $this->connection->get($url, array('screen_name' => $screenName, "count" => 200,"max_id" => $id, 'exclude_replies' => true, 'include_rts' => false,));
			$object1 = array_merge($object1,$object2);
			
			
			
				foreach($object1 as $key => $value) {
					$twitter_date = strtotime($value->created_at);
					$datediff = $now - $twitter_date;
					$hour_diff = floor($datediff/(60*60));
					if($hour_diff > 240) {
					
						unset($object1 [$key]);
					}
			
				}
			
		}	
		$array = $object1;
		
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($array));
		}
		else {
			return $object;
		}
	}
	
	public function limitExceeded() {
		$this->load->view('limit_exceeded');
	}
	
}
