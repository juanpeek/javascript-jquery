<?php

require_once "connection.php";


$rest = htmlspecialchars($_REQUEST['rest']);
$emp = htmlspecialchars($_REQUEST['emp']);
$fecha = htmlspecialchars($_REQUEST['fecha']);
$mesa= htmlspecialchars($_REQUEST['mesa']);
$cli=htmlspecialchars($_REQUEST['nameApeCli']);
$comen=htmlspecialchars($_REQUEST['numCom']);

$jsondata = array();

$sql = "";

try {
	$stmt = $pdo->prepare("INSERT INTO reservas VALUES(NULL,'$rest','$emp','$fecha','$mesa','$cli',$comen)");
	$stmt->execute();
	$jsondata['id'] = $pdo->lastInsertId();
} catch (PDOException $e) {
	$jsondata["mensaje"]="Error";
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$pdo=null;
exit();

