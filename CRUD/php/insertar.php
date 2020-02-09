<?php
require_once "connection.php";

$chip=$_REQUEST["chip"];
$nombre=$_REQUEST["nombre"];
$raza=$_REQUEST["raza"];
$fechaN=$_REQUEST["fechaN"];

$jsondata=array();

$insertar="INSERT INTO perros VALUES('$chip','$nombre','$raza', '$fechaN')";
$respuesta=$connection->query($insertar);
if(!$respuesta){
    $jsondata["mensaje"][]="Error";
};

header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();

exit();
