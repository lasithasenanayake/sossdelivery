<?php
require_once("../config.php");
require_once("../carbite.php");

function getPostBody() {
    $rawInput = fopen('php://input', 'r');
    $tempStream = fopen('php://temp', 'r+');
    stream_copy_to_stream($rawInput, $tempStream);
    rewind($tempStream);
    return stream_get_contents($tempStream);
}

Carbite::GET("/test",function($req,$res){
    $res->Set("Hello World");
});

Carbite::GET("/get/@ns/@name",function($req,$res){
    $ns = $req->Params()->ns;
    $name = $req->Params()->name;
    $folder = MEDIA_FOLDER . "/".  $_SERVER["HTTP_HOST"] . "/$ns";

    header("Content-Type: image/png");
    echo file_get_contents("$folder\\$name");
    exit();
});

Carbite::POST("/upload/@ns/@name",function($req,$res){
    $ns = $req->Params()->ns;
    $name = $req->Params()->name;
    $folder = MEDIA_FOLDER . "/".  $_SERVER["HTTP_HOST"] . "/$ns";
    
    if (!file_exists($folder))
        mkdir($folder, 0777, true);

    file_put_contents("$folder/$name", getPostBody());
    $resObj = new stdClass();
    $resObj->sucess = true;
    $resObj->message = "Successfully Uploaded!!!";
    $res->Set($resObj);
});

Carbite::Start();
?>
