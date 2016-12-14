<?php
require_once("../config.php");
require_once("../carbitetransform.php");

CarbiteTransform::RESTROUTE("GET","/hello/@name", "POST", "http://localhost:9000/data/@name", "{'name': '@name'}");

Carbite::Start();
?>