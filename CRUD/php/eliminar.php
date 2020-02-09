<?php
require_once "connection.php";
$perro=$_REQUEST["chip"];

$jsondata = array();

$sql="DELETE FROM perros WHERE chip='$perro'";

$respuesta=$connection->query($sql);
if(!$respuesta){
    $jsondata["mensaje"][]="Error";
};
    

header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();

exit();
?>