<?php

require_once "connection.php";


$id = htmlspecialchars($_REQUEST['idrest']);
$fecha = htmlspecialchars($_REQUEST['fecha']);


$jsondata = array();
try {
    $stmt = $pdo->prepare("SELECT idreservas, mesa, nomapecli FROM `reservas` WHERE idrest=$id AND fecha='$fecha'");
   
    $stmt->execute();
    while ($row = $stmt->fetch()) {
        $jsondata["data"][] = $row;
    }     
    
} catch (PDOException $e) {
    $jsondata["mensaje"][]="Error";
}


header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$pdo=null;
exit();
