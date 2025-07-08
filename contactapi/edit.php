<?php
    require 'connect.php';

    // Get the posted data
    $postdata = file_get_contents("php://input");

    if (isset($postdata) && !empty($postdata))
    {
        // Extract the data
        $request = json_decode($postdata);

        // Validate
        if ((int)$request->data->contactID < 1 || trim($request->data->firstName) === '' || trim($request->data->lastName) === '' ||
            trim($request->data->emailAddress) === '' || trim($request->data->phone) === '')
            {
                return http_response_code(400);
            }

        // Sanitize
        $contactID = mysqli_real_escape_string($con, (int)$request->data->contactID);
        $firstName = mysqli_real_escape_string($con, $request->data->firstName);
        $lastName = mysqli_real_escape_string($con, $request->data->lastName);
        $emailAddress = mysqli_real_escape_string($con, $request->data->emailAddress);
        $phone = mysqli_real_escape_string($con, $request->data->phone);

        $sql = "UPDATE `contacts` SET `firstName`='$firstName', `lastName`='$lastName', `emailAddress`='$emailAddress', `phone`='$phone' WHERE `contactID` = '{$contactID}' LIMIT 1";

        if(mysqli_query($con, $sql))
        {
            http_response_code(204);
        }
        else
        {
            http_response_code(422);
        }
    }
?>