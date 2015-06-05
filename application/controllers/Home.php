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

		$url = "search/tweets";
		$params = array(
		"q" => $hashtag,
		"result_type" => "recent",		
		"count" => 100, );
		$object = $this->connection->get($url, $params);
		//$id = $object->statuses[99]->id;
		$array = $object->statuses;
		$id = end($array)->id;
		$object2 = $this->connection->get($url, array("q" => $hashtag,"result_type" => "recent", "count" => 100,"max_id" => $id,));
		//$object1 = $object + $object2;
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($object2));
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

		$url = 'statuses/user_timeline';
		$params = array('screen_name' => $screenName, 'count' => 10);
		$object = $this->connection->get($url, $params);
		
		if($this->input->is_ajax_request()) {
			$this->output->set_output(json_encode($object));
		}
		else {
			return $object;
		}
	}
	
	public function limitExceeded() {
		$this->load->view('limit_exceeded');
	}
	
}
