<?php
    require 'connect.php';

    // Get the posted data
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {

        // Extract the data
        $request = json_decode($postdata);

        // Validate
        if(trim($request->data->firstName) === '' || trim($request->data->lastName) === '' ||
            trim($request->data->emailAddress) === '' || trim($request->data->phone) === '' ||
            trim($request->data->status) === '' || trim($request->data->dob) === '')
            {
                return http_response_code(400);
            }

        // Sanitize
        $firstName = mysqli_real_escape_string($con, trim($request->data->firstName));
        $lastName = mysqli_real_escape_string($con, trim($request->data->lastName));
        $emailAddress = mysqli_real_escape_string($con, trim($request->data->emailAddress));
        $phone = mysqli_real_escape_string($con, trim($request->data->phone));
        $status = mysqli_real_escape_string($con, trim($request->data->status));
        $dob = mysqli_real_escape_string($con, trim($request->data->dob));
        $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));

        $origimg = str_replace('\\', '/', $imageName);
        $new = basename($origimg);

        // Store the data
        $sql = "INSERT INTO `contacts`(`contactID`,`firstName`,`lastName`, `emailAddress`, `phone`, `status`, `dob`, `imageName`) VALUES (null,'{$firstName}','{$lastName}','{$emailAddress}','{$phone}','{$status}','{$dob}', '{$new}')";

        if(mysqli_query($con, $sql))
        {
            http_response_code(201);

            $contact = [
                'firstName' => $firstName,
                'lastName' => $lastName,
                'emailAddress' => $emailAddress,
                'phone' => $phone,
                'status' => $status,
                'dob' => $dob,
                'imageName' => $new,
                'contactID' => mysqli_insert_id($con)
            ];

            echo json_encode(['data'=>$contact]);
        }
        else
        {
            http_response_code(422);
        }

    }
    
?>