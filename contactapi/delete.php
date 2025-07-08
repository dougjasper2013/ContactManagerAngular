<?php
    require 'connect.php';

    $contactID = ($_GET['contactID'] !== null && (int)$_GET['contactID'] > 0) ? mysqli_real_escape_string($con, (int)$_GET['contactID']) : false;

    if (!$contactID)
    {
        return http_response_code(400);
    }
    
    $sql ="DELETE FROM `contacts` WHERE `contactID` ='{$contactID}' LIMIT 1";

    if(mysqli_query($con, $sql))
    {
        http_response_code(204);
    }
    else
    {
        http_response_code(422);
    }
    
?>