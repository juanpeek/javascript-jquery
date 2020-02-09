<?php
require_once "connection.php";

$id=htmlspecialchars($_REQUEST["id"]);

$jsondata = array();


try {
	$stmt = $pdo->prepare("DELETE FROM reservas WHERE idreservas=$id");
	$stmt->execute();
} catch (PDOException $e) {
	$jsondata["mensaje"][]="Error";
}
    

header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$pdo=null;

exit();
?>