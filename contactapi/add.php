<?php
require 'connect.php';

// Get the posted data
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    // Extract the data
    $request = json_decode($postdata);

    // Validate
    if (trim($request->data->firstName) === '' || trim($request->data->lastName) === '' ||
        trim($request->data->emailAddress) === '' || trim($request->data->phone) === '' ||
        trim($request->data->status) === '' || trim($request->data->dob) === '') {
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
    if (empty($new)) {
        $new = 'placeholder_100.jpg';
    }

    // 🔍 Check for duplicate email
    $checkEmailSql = "SELECT 1 FROM contacts WHERE emailAddress = '{$emailAddress}'";
    $checkEmailResult = mysqli_query($con, $checkEmailSql);
    if (mysqli_num_rows($checkEmailResult) > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'Duplicate email address.']);
        exit;
    }

    // 🔍 Check for duplicate imageName (excluding placeholder image)
    if ($new !== 'placeholder_100.jpg') {
        $checkImageSql = "SELECT 1 FROM contacts WHERE imageName = '{$new}'";
        $checkImageResult = mysqli_query($con, $checkImageSql);
        if (mysqli_num_rows($checkImageResult) > 0) {
            http_response_code(409); // Conflict
            echo json_encode(['message' => 'Duplicate image name.']);
            exit;
        }
    }

    // Insert into DB
    $sql = "INSERT INTO `contacts`(`contactID`,`firstName`,`lastName`, `emailAddress`, `phone`, `status`, `dob`, `imageName`) 
            VALUES (null,'{$firstName}','{$lastName}','{$emailAddress}','{$phone}','{$status}','{$dob}', '{$new}')";

    if (mysqli_query($con, $sql)) {
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
        echo json_encode(['data' => $contact]);
    } else {
        http_response_code(422);
    }
}
?>
