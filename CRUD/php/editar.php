<?php
require_once "connection.php";

$chip=$_REQUEST["chip"];
$nombre=$_REQUEST["nombre"];
$raza=$_REQUEST["raza"];
$fechaN=$_REQUEST["fechaN"];

$jsondata=array();

$insertar="UPDATE `perros` SET `chip`='$chip',`nombre`='$nombre',`raza`='$raza',`fechaNac`='$fechaN' WHERE chip='$chip'";
$respuesta=$connection->query($insertar);
if(!$respuesta){
    $jsondata["mensaje"][]="Error";
};

header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();

exit();
