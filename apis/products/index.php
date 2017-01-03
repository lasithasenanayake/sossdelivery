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

CarbiteTransform::RESTROUTE("POST","/insert", "POST", OS_URL ."/products", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");
CarbiteTransform::RESTROUTE("POST","/update", "PUT", OS_URL ."/products", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");


CarbiteTransform::RESTROUTE("GET","/all", "GET", OS_URL ."/products");

CarbiteTransform::RESTROUTE("GET","/bycat/@catid", "GET", OS_URL ."/products?query=catogory:@catid");
CarbiteTransform::RESTROUTE("GET","/byid/@iid", "GET", OS_URL ."/products?query=itemid:@iid");

CarbiteTransform::RESTROUTE("GET","/categories/all", "GET", OS_URL ."/productcat");
CarbiteTransform::RESTROUTE("POST","/categories/insert", "POST", OS_URL ."/productcat", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");
CarbiteTransform::RESTROUTE("POST","/categories/update", "PUT", OS_URL ."/productcat", new PostBodyTemplate($pbTemplate), null,"checkAdminFilter");
CarbiteTransform::RESTROUTE("GET","/categories/byid/@catid", "GET", OS_URL ."/productcat?query=id:@catid");

Carbite::Start();
?>