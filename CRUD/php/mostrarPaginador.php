<?php
require_once "connection.php";


$jsondata = array();

$sql="SELECT * FROM perros";

if ($result = $connection->query($sql)) {
    
    while ($row = $result->fetch_object()) {
        $jsondata["data"][] = $row;
       
    }
}
 
$result->close();


header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);

$connection->close();

exit();
?>