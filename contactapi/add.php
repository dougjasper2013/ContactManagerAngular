<?php
require 'connect.php';
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Get the posted data
$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    // Validate required fields
    if (trim($request->data->firstName) === '' || trim($request->data->lastName) === '' ||
        trim($request->data->emailAddress) === '' || trim($request->data->phone) === '' ||
        trim($request->data->status) === '' || trim($request->data->dob) === '') {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields.']);
        exit;
    }

    // Sanitize
    $firstName = mysqli_real_escape_string($con, trim($request->data->firstName));
    $lastName = mysqli_real_escape_string($con, trim($request->data->lastName));
    $emailAddress = mysqli_real_escape_string($con, trim($request->data->emailAddress));
    $phone = mysqli_real_escape_string($con, trim($request->data->phone));
    $status = mysqli_real_escape_string($con, trim($request->data->status));
    $dob = mysqli_real_escape_string($con, trim($request->data->dob));
    $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));
    $typeID = mysqli_real_escape_string($con, trim($request->data->typeID));

    // Extract filename
    $origimg = str_replace('\\', '/', $imageName);
    $new = basename($origimg);
    if (empty($new)) {
        $new = 'placeholder_100.jpg';
    }

    // ✅ Allowed image extensions
    $allowedExt = ['jpg', 'jpeg', 'png', 'gif'];
    $ext = strtolower(pathinfo($new, PATHINFO_EXTENSION));
    if ($new !== 'placeholder_100.jpg' && !in_array($ext, $allowedExt)) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid image format. Only JPG, PNG, and GIF allowed.']);
        exit;
    }

    // 🔍 Check duplicate email
    $checkEmailSql = "SELECT 1 FROM contacts WHERE emailAddress = '{$emailAddress}'";
    $checkEmailResult = mysqli_query($con, $checkEmailSql);
    if (mysqli_num_rows($checkEmailResult) > 0) {
        http_response_code(409);
        echo json_encode(['message' => 'Duplicate email address.']);
        exit;
    }

    // 🔍 Check duplicate image name
    if ($new !== 'placeholder_100.jpg') {
        $checkImageSql = "SELECT 1 FROM contacts WHERE imageName = '{$new}'";
        $checkImageResult = mysqli_query($con, $checkImageSql);
        if (mysqli_num_rows($checkImageResult) > 0) {
            http_response_code(409);
            echo json_encode(['message' => 'Duplicate image name.']);
            exit;
        }
    }

    // ✅ Insert into database
    $sql = "INSERT INTO `contacts`(`contactID`,`firstName`,`lastName`, `emailAddress`, `phone`, `status`, `dob`, `imageName`, `typeID`) 
            VALUES (null,'{$firstName}','{$lastName}','{$emailAddress}','{$phone}','{$status}','{$dob}', '{$new}', '{$typeID}')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
        echo json_encode([
            'data' => [
                'contactID' => mysqli_insert_id($con),
                'firstName' => $firstName,
                'lastName' => $lastName,
                'emailAddress' => $emailAddress,
                'phone' => $phone,
                'status' => $status,
                'dob' => $dob,
                'imageName' => $new,
                'typeID' => $typeID
            ]
        ]);
    } else {
        http_response_code(422);
        echo json_encode(['message' => 'Database insert failed.']);
    }
}
?>
