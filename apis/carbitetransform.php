<?php

require_once (__DIR__ . "/carbite.php");

class PostBodyTemplate {
    private $template;
    
    function __construct($template){
        $this->template = $template;
    }

    function getBody($data){
        return str_replace("@@body@@",$data, $this->template);
    }
}

class CarbiteTransform {

    static $mappings = array();

    private static function getPostBody() {
        $rawInput = fopen('php://input', 'r');
        $tempStream = fopen('php://temp', 'r+');
        stream_copy_to_stream($rawInput, $tempStream);
        rewind($tempStream);
        return stream_get_contents($tempStream);
    }

    private static function sendRequest($mObj){
        $ch=curl_init();
        
        //$currentHeaders = apache_request_headers();
        $forwardHeaders = $mObj->rh;
        array_push($forwardHeaders, "Host: $_SERVER[HTTP_HOST]");
        array_push($forwardHeaders, "Content-Type: application/json");
        /*
        foreach ($currentHeaders as $key => $value)
            if (!(strcmp(strtolower($key), "host") ===0 || strcmp(strtolower($key),"content-type")===0))
                array_push($forwardHeaders, "$key : $value");
        */
        curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
        curl_setopt($ch, CURLOPT_URL, $mObj->rp);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $mObj->rm);

        if(isset($mObj->rb)){            
            $postData = $mObj->rb;
            curl_setopt($ch, CURLOPT_POST, count($postData));
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        }

        $data = curl_exec($ch);
        $content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        header("Content-type: $content_type");
        http_response_code($httpcode);
        echo $data;
        exit();	
    }


    public static function RESTROUTE ($m, $p, $rm, $rp, $rb = null, $rh = array(), $filter = null) {
        $mObj = new stdClass();
        $mObj->rm = $rm;
        $mObj->rp = $rp;
        $mObj->rb = $rb;
        $mObj->rh = $rh;
        self::$mappings["$m:$p"] = $mObj;

        Carbite::HANDLE ($m, $p, function($req,$res){
            $allParams = array();
            $tmpParams = $req->Params();
        
            foreach ($_GET as $key => $value)
            if (!isset($tmpParams->$key)) 
                $tmpParams->$key = $value;
                
            foreach ($tmpParams as $key => $value)
                $allParams["@$key"] = $value;


            $mObj = self::$mappings["$req->method:$req->template"];
            
            $mObj->rp = strtr($mObj->rp,$allParams);
            
            $rawBody = self::getPostBody();
            if (isset($mObj->rb)) {
                
                if (is_object($mObj->rb))
                    $mObj->rb = $mObj->rb->getBody($rawBody);

                $mObj->rb = strtr($mObj->rb,$allParams);
            }

            $tmpHeaders = array();
            if (isset($mObj->rh))
            foreach ($mObj->rh as $key => $value){
                if (isset($allParams[$value]))
                    array_push($tmpHeaders, "$key: ". $allParams[$value]);
                else
                    array_push($tmpHeaders,"$key: ". $value);
            }
            $mObj->rh = $tmpHeaders;
            
            $res->SetJSON(self::sendRequest($mObj));
        }, $filter);

    }

}

?>