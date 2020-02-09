<?php

require_once "connection.php";

$dni = $_REQUEST['dni'];
$inmueble = $_REQUEST['inmueble'];


$jsondata = array();

$sql="INSERT INTO reservas VALUES(NULL,'$dni',$inmueble, CURDATE())";


$respuesta=$connection->query($sql);
 if(!$respuesta){
    $jsondata["mensaje"]="Error";
 };
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();
exit();


