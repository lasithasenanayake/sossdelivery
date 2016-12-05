<?php
class CReq {

	public function Params(){return $this->p;}
	public function Query(){return $this->$qP;}
	public function Headers(){return $this->$hP;}
	public function Body(){return $_POST;}
	public function GetContentType(){return "";}

	function __construct($params){
		$this->p = $params;
		$this->qP = $this->aTo($_GET);
		$this->hP = $this->aTo(getallheaders());
	}

	function aTo($a){
		$o = new stdClass();
		foreach ($a as $k => $v) $o->$k = $v;
		return $o;
	}
}

class CRes {
	public function Get(){return $this->o;}
	public function Set($o){$this->o = $o;}
	public function SetContentType($c){$this->ct = $c;}
	public function GetContentType(){return $this->ct;}
	public function SetError($e){$this->e = $e;}
	public function GetError(){return $this->e;}
	public function SetJSON($o,$s=true){$t = new stdClass(); $t->success = $s; $t->result = $o; $this->o = $t;}
}

class Carbite {

	static $cbf;
	static $cbp;
	static $rParts;

	public static function GET ($p, $f) {self::chk("GET", $p, $f);}
	public static function POST ($p, $f) {self::chk("POST", $p, $f);}
	public static function PUT ($p, $f) {self::chk("PUT", $p, $f);}
	public static function DELETE ($p, $f) {self::chk("DELETE",$p, $f);}

	public static function Start(){
		if (isset(self::$cbf)) self::call(self::$cbf, self::$cbp);
		else {http_response_code(404); echo "404 : Not Found :[";}
	}

	static function getRoute() {
		$bp = str_replace($_SERVER["DOCUMENT_ROOT"],"", str_replace("carbite.php","",str_replace("\\","/",__FILE__)));
		return str_replace(str_replace($_SERVER['DOCUMENT_ROOT'], "", $bp), "", $_SERVER['REQUEST_URI']);
	}

	static function chk($m, $pa, $fu){

		if (strcmp($m, $_SERVER["REQUEST_METHOD"]) == 0) {
			if (!isset(self::$rParts)) {
				$rPath = self::getRoute();
				$qi = strpos($rPath, '?');
				if ($qi) $rPath = substr($rPath, 0, $qi);
				self::$rParts = array_map('trim', explode('/', $rPath));
			}
			$cParts = explode("/", $pa);
			if (sizeof($cParts) == sizeof(self::$rParts)){
				$matched = true;
				$p = new stdClass();
				for($i=0; $i<sizeof($cParts); $i++)
					if (strlen($cParts[$i]) !=0){
						if ($cParts[$i][0] == '@'){
							$f = substr($cParts[$i], 1);
							$p->$f = self::$rParts[$i];
						} else {
							if (strcmp($cParts[$i], self::$rParts[$i]) != 0) { $matched = false; break; }
						}
					}
				if ($matched){self::$cbp = $p;self::$cbf = $fu;}
			}
		}
	}

	static function call($f, $p){
		$req = new CReq($p);
		$res = new CRes();
		$f($req, $res);
		self::out($res);
	}

	public static function out($res){
		$out = $res->Get();		

		if (isset($out)){
			if (is_object($out) || is_array($out)){$ct = "application/json"; $out = json_encode($out, JSON_PRETTY_PRINT);}
			else {if ($out[0] == '{') $ct = "application/json";}
		}

		if (!isset($ct)) $ct = "text/plain";

		header("Content-type: ". $ct);
		echo $out;
	}
}

function CERR($en, $es, $ef, $el){
	$ec = new Exception();
	$ec->no = $en;
	$ec->message = $es;
	$ec->filename = $ef;
	$ec->line = $el;
	throw $ec;
}

function CEXP($e){
	$r = new CRes();
	$r->SetJSON($e,false);
	Carbite::out($r);
}

set_error_handler("CERR", E_ALL);
set_exception_handler("CEXP");
?>