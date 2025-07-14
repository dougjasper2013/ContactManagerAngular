<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    if ((int)$request->data->contactID < 1 || trim($request->data->firstName) === '' || trim($request->data->lastName) === ''
        || trim($request->data->emailAddress) === '' || trim($request->data->phone) === '') {
        return http_response_code(400);
    }

    $contactID = mysqli_real_escape_string($con, (int)$request->data->contactID);
    $firstName = mysqli_real_escape_string($con, $request->data->firstName);
    $lastName = mysqli_real_escape_string($con, $request->data->lastName);
    $emailAddress = mysqli_real_escape_string($con, $request->data->emailAddress);
    $phone = mysqli_real_escape_string($con, $request->data->phone);
    $status = mysqli_real_escape_string($con, $request->data->status);
    $dob = mysqli_real_escape_string($con, $request->data->dob);
    $imageName = mysqli_real_escape_string($con, $request->data->imageName ?? '');
    $oldImageName = mysqli_real_escape_string($con, $request->data->oldImageName ?? '');

    if ($imageName !== '' && $imageName !== $oldImageName && $oldImageName !== 'placeholder_100.jpg') {
        $oldFilePath = 'uploads/' . $oldImageName;
        if (file_exists($oldFilePath)) {
            unlink($oldFilePath);
        }
    }

    $sql = "UPDATE `contacts` SET 
              `firstName`='$firstName', 
              `lastName`='$lastName', 
              `emailAddress`='$emailAddress', 
              `phone`='$phone', 
              `status`='$status', 
              `dob`='$dob',
              `imageName`='$imageName'
            WHERE `contactID` = '{$contactID}' LIMIT 1";

    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        http_response_code(422);
    }
}
?>
