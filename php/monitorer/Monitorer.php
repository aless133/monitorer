<?
namespace a133\monitorer;

class Monitorer {

	public $dataDir=__DIR__;
	public $watches=[];

	function __construct($cfg=[]) {
		foreach ($cfg as $k=>$v)
			$this->$k=$v;
		$this->dataFile=$this->dataDir.'/monitorer.data';
		if (file_exists($this->dataFile))
			$this->data=json_decode(file_get_contents($this->dataFile),1);
	}

	public function check() {
		$notify=[];
		foreach ($this->watches as $watch => $cfg) {
			$old=$this->data[$watch]??0;
			require_once(__DIR__.'/'.$cfg['parser'].'.php');
			$class="a133\\monitorer\\".$cfg['parser'];
			// $class=$cfg['parser'];
			$parser=new $class;
			$new=$parser->findNew($cfg['url'],$old);
			if (count($new)) {
				$this->data[$watch]=$new['max'];
				$notify[$watch]=$new['urls'];
			}
		}
		if (count($notify)) {
			$this->notify($notify);
			file_put_contents($this->dataFile,json_encode($this->data));
		}
		return $notify;
	}

	public $notifierToken="1999715522:AAHS8pZ7uqhZD6EcRzM2zZQj622WwrKYt88";
	public $notifierChat="-534524142";

	public function notify($notify) {
		$text='';
		foreach ($notify as $key => $n) {
			if ($text) $text.="\n";
			$text.="$key\n".implode("\n",$n)."\n";
		}
		$this->notifySend($text);
	}

	public function notifySend($message) {
		$url = "https://api.telegram.org/bot" . $this->notifierToken . "/sendMessage?chat_id=" . $this->notifierChat;
    $url .= "&text=" . urlencode($message);
    // $url .= "&parse_mode=MarkdownV2";
    // var_dump($url);
    $ch = curl_init();
    $optArray = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,  
    );
    curl_setopt_array($ch, $optArray);
    $result = curl_exec($ch);		
    // var_dump($result);
	}

}