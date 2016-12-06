<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once("../carbitetransform.php");
define ("OS_URL", "http://localhost:9000/data");

$productInsert = <<<EOT
{
	"object":{
		"itemid":@id,
		"name":"Test-Featured",
		"caption":"Test-Featured",
		"price":100.50,
		"imgurl":"http://placehold.it/320x150",
		"catogory":"Featured"
	}
}
EOT;

CarbiteTransform::RESTROUTE("GET","/products/savetest/@id", "POST", OS_URL ."/products", $productInsert);
CarbiteTransform::RESTROUTE("GET","/products/all", "GET", OS_URL ."/products");
CarbiteTransform::RESTROUTE("GET","/products/bycat/@catid", "GET", OS_URL ."/products?query=catogory:@catid");

Carbite::Start();
?>