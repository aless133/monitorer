<?
namespace a133\monitorer;
use a133\env\Env;

include __DIR__.'/Env.php';


class Monitorer {

	public $dataDir=__DIR__;
	public $watches=[];
	public $data=[];
	public $dataFile='';
	public $notifierToken;
	public $notifierChat;

	function __construct($cfg=[]) {
		foreach ($cfg as $k=>$v)
			$this->$k=$v;
		$this->dataFile=$this->dataDir.'/monitorer.data';
		if (file_exists($this->dataFile))
			$this->data=json_decode(file_get_contents($this->dataFile),1);
		$this->notifierToken=Env::get('TELEGRAM_BOT_TOKEN');
		$this->notifierChat=Env::get('TELEGRAM_CHAT_ID');
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