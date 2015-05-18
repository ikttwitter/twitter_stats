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
			'twitter-wjs.js',
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
		
		$data['trends'] = $this->topHashtags();
		$this->load->view('index', $data);
	}
	
	public function searchByHashtag($hashtag) {
		$url = 'search/tweets';
		$params = array('q' => $hashtag, 'count' => 100);
		$object = $this->connection->get($url, $params);
		$this->output->set_output(json_encode($object));
	}
	
	public function topHashtags() {
		$url = 'trends/place';
		$params = array('id' => '1');
		$object = $this->connection->get($url, $params);
		return $object[0]->trends;
	}
	
	public function searchByUser($user) {
		$url = 'users/search';
		$params = array('q' => $user, 'count' => 100);
		$object = $this->connection->get($url, $params);
		$this->output->set_output(json_encode($object));
	}
	
}
