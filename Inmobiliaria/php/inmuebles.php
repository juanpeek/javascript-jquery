<?php

require_once "connection.php";

$zona = $_REQUEST['zona'];
$habitaciones = $_REQUEST['habitaciones'];
$precio = $_REQUEST['precio'];

$jsondata["data"] = array();

$sql="SELECT * FROM `inmuebles` WHERE habitaciones=$habitaciones and precio<=$precio and zona=$zona";

if ($result = $connection->query($sql)) {
    
    while ($row = $result->fetch_object()) {
        $jsondata["data"][] = $row;
    }
}
 
$result->close();
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);


exit();


