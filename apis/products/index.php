<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once("../carbitetransform.php");

define ("OS_URL", "http://localhost:9000/data");
$pbTemplate = <<<EOT
{
	"object":@@body@@
}
EOT;

function checkAdminFilter(){
	
}

function tokenCheckFilter (){
	
}

//Carbite::GLOBALFILTER("tokenCheckFilter");
CarbiteTransform::RESTROUTE("POST","/products/save", "POST", OS_URL ."/products", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");
CarbiteTransform::RESTROUTE("GET","/products/all", "GET", OS_URL ."/products");
CarbiteTransform::RESTROUTE("GET","/products/bycat/@catid", "GET", OS_URL ."/products?query=catogory:@catid");
CarbiteTransform::RESTROUTE("GET","/products/byid/@iid", "GET", OS_URL ."/products?query=itemid:@iid");

Carbite::Start();
?>