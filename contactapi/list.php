<?php
    require 'connect.php';

    $contacts = [];
    $sql = "SELECT contactID, firstName, lastName, emailAddress, phone, status, dob, imageName, typeID FROM contacts";

    if ($result = mysqli_query($con, $sql))
    {
        $count = 0;
        while ($row = mysqli_fetch_assoc($result))
        {
            $contacts[$count]['contactID'] = $row['contactID'];
            $contacts[$count]['firstName'] = $row['firstName'];
            $contacts[$count]['lastName'] = $row['lastName'];
            $contacts[$count]['emailAddress'] = $row['emailAddress'];
            $contacts[$count]['phone'] = $row['phone'];
            $contacts[$count]['status'] = $row['status'];
            $contacts[$count]['dob'] = $row['dob'];
            $contacts[$count]['imageName'] = $row['imageName'];
            $contacts[$count]['typeID'] = $row['typeID'];

            $count++;
        }

        echo json_encode(['data'=>$contacts]);
    }
    else
    {
        http_response_code(404);
    }
?>