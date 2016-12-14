<?php
class CReq {

	public function Params(){return $this->p;}
	public function Query(){return $this->$qP;}
	public function Headers(){return $this->$hP;}
	public function Body(){return $_POST;}
	public function GetContentType(){return "";}

	function __construct($params, $m, $p){
		$this->method = $m;
		$this->template = $p;
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

	static $cbf,$cbp, $cbfil, $gfil;
	static $rParts;
	static $m, $p;

	public static function GET ($p, $f, $fil=null) {self::chk("GET", $p, $f, $fil);}
	public static function POST ($p, $f, $fil=null) {self::chk("POST", $p, $f, $fil);}
	public static function PUT ($p, $f, $fil=null) {self::chk("PUT", $p, $f, $fil);}
	public static function DELETE ($p, $f, $fil=null) {self::chk("DELETE",$p, $f, $fil);}
	public static function HANDLE ($m, $p, $f, $fil=null) {self::chk($m,$p, $f, $fil);}

	public static function GLOBALFILTER($f){
		if (!isset(self::$gfil)) self::$gfil = array();
			
		if (is_array($f)){
			foreach ($f as $f1)
				array_push(self::$gfil, $f);
		} else array_push(self::$gfil, $f); 
	}

	public static function Start(){
		if (isset(self::$cbf)) self::call(self::$cbf, self::$cbp);
		else {http_response_code(404); echo "404 : Not Found :[";}
	}

	static function getRoute() {
		$bp = str_replace($_SERVER["DOCUMENT_ROOT"],"", str_replace("\\","/",__DIR__)) . "/";
		$r = str_replace(str_replace($_SERVER['DOCUMENT_ROOT'], "", $bp), "", $_SERVER['REQUEST_URI']);
		if ($r[0] !== "/") $r = "/$r";
		return $r;
	}

	static function filterEval(){
		if (isset(self::$gfil))
			foreach (self::$gfil as $f) $f();

		if (isset(self::$cbfil)){
			if (is_array(self::$cbfil)){
				foreach (self::$cbfil as $f) $f();
			} else {$f = self::$cbfil;$f();} 
		}
	}

	static function chk($m, $pa, $fu, $fil){
		$mdn = basename(dirname($_SERVER['SCRIPT_FILENAME']));
		$cbp = basename(__DIR__);
		if (strcmp($mdn, $cbp) != 0) $pa = "/$mdn$pa";
		
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
					
				if ($matched){self::$cbp = $p;self::$cbf = $fu;self::$m=$m; self::$p=$pa; self::$cbfil=$fil;}
			}
		}
	}

	static function call($f, $p){
		self::filterEval();
		$req = new CReq($p, self::$m, self::$p);
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
	$ec = new Exception($es);
	$ec->no = $en;
	//$ec->message = $es;
	$ec->filename = $ef;
	//$ec->line = $el;
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