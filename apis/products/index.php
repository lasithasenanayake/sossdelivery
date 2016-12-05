<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once("../carbite.php");

Carbite::GET("/hello/@name",function($req,$res){
	$res->SetJSON("Hello ". $req->Params()->name);
});

Carbite::GET("/@type",function($req,$res){
	$products=array();
	$x=0;
	while($x<100){
		$product = new stdClass();
		$product->itemid=$x;
		$product->name="Product ".$x;
		$product->caption="This the product description ";
		$product->price=rand(10, 100);
		$product->imgurl="http://placehold.it/320x150";
		$product->catogory="lunch";
		array_push($products,$product);
		$x++;
	}	
	$res->SetJSON($products);
});

Carbite::Start();
?>