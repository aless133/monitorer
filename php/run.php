<?
ini_set('error_reporting', E_ALL);
ini_set('display_errors',1);
ini_set('log_errors',1);
ini_set('error_log',__DIR__.'/runtime/php_error.log');

include __DIR__.'/monitorer/Monitorer.php';

$m=new a133\monitorer\Monitorer([
	'dataDir'=>__DIR__.'/runtime',
	'watches'=>[
			'kuhnia'=>[
				'parser'=>'KufarParser',
				'url'=>'https://www.kufar.by/listings?size=42&sort=lst.d&cur=BYR&cat=21050&rgn=7&cnd=1',
			]
		]
	]);

$r=$m->check();
echo date('c').' ';
var_dump($r);

