<?php
require 'connect.php';

// Sanitize and validate inputs
$contactID = isset($_POST['contactID']) ? (int)$_POST['contactID'] : 0;
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$emailAddress = trim($_POST['emailAddress'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$status = trim($_POST['status'] ?? '');
$dob = trim($_POST['dob'] ?? '');
$originalImageName = $_POST['originalImageName'] ?? '';

// Validation
if (
    $contactID < 1 || $firstName === '' || $lastName === '' ||
    $emailAddress === '' || $phone === ''
) {
    http_response_code(400);
    exit;
}

// Sanitize for DB
$contactID = mysqli_real_escape_string($con, $contactID);
$firstName = mysqli_real_escape_string($con, $firstName);
$lastName = mysqli_real_escape_string($con, $lastName);
$emailAddress = mysqli_real_escape_string($con, $emailAddress);
$phone = mysqli_real_escape_string($con, $phone);
$status = mysqli_real_escape_string($con, $status);
$dob = mysqli_real_escape_string($con, $dob);

$imageName = $originalImageName;

// Check if a new image is uploaded
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $uploadFileDir = './uploads/';
    $dest_path = $uploadFileDir . $fileName;

    if (move_uploaded_file($fileTmpPath, $dest_path)) {
        $imageName = $fileName;

        // Delete old image if not placeholder
        if ($originalImageName !== 'placeholder_100.jpg') {
            $oldImagePath = $uploadFileDir . $originalImageName;
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
        exit;
    }
}

// Update the contact
$imageName = mysqli_real_escape_string($con, $imageName);

$sql = "UPDATE `contacts` SET 
          `firstName` = '$firstName',
          `lastName` = '$lastName',
          `emailAddress` = '$emailAddress',
          `phone` = '$phone',
          `status` = '$status',
          `dob` = '$dob',
          `imageName` = '$imageName'
        WHERE `contactID` = '$contactID'
        LIMIT 1";

if (mysqli_query($con, $sql)) {
    http_response_code(200);
    echo json_encode(['message' => 'Contact updated']);
} else {
    http_response_code(422);
    echo json_encode(['error' => 'Database update failed']);
}
