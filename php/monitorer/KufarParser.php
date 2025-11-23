<?
namespace a133\monitorer;

class KufarParser {

	function findNew($url,$old) {

		$h=file_get_contents($url);
		// var_dump(strlen($h));
		$mc=preg_match_all('/<a class="[^"]+" href="https:\/\/www.kufar.by\/item\/(\d+)" target="_blank">/',$h,$matches,PREG_SET_ORDER);
		$ret=[];
		foreach($matches as $m) {
			if ((int)$m[1]>$old) {
				$ret['urls'][]='https://www.kufar.by/item/'.$m[1];
				$ret['max']=max($ret['max']??0,$m[1]);
			}
		}
		return $ret;
	}


}