<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once("../carbitetransform.php");

CarbiteTransform::RESTROUTE("GET","/auth/hello/@name", "POST", "http://localhost:9000/data/@name", "{'name': '@name'}");

Carbite::Start();
?>