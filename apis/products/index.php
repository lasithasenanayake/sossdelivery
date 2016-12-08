<?php
require_once("../config.php");
require_once("../carbitetransform.php");

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
CarbiteTransform::RESTROUTE("POST","/products/insert", "POST", OS_URL ."/products", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");
CarbiteTransform::RESTROUTE("POST","/products/update", "PUT", OS_URL ."/products", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");

CarbiteTransform::RESTROUTE("GET","/products/all", "GET", OS_URL ."/products");
CarbiteTransform::RESTROUTE("GET","/products/bycat/@catid", "GET", OS_URL ."/products?query=catogory:@catid");
CarbiteTransform::RESTROUTE("GET","/products/byid/@iid", "GET", OS_URL ."/products?query=itemid:@iid");

Carbite::Start();
?>