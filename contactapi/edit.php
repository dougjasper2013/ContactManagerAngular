<?php
require 'connect.php';
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Parse form data
$contactID = isset($_POST['contactID']) ? (int) $_POST['contactID'] : 0;
$firstName = mysqli_real_escape_string($con, $_POST['firstName'] ?? '');
$lastName = mysqli_real_escape_string($con, $_POST['lastName'] ?? '');
$emailAddress = mysqli_real_escape_string($con, $_POST['emailAddress'] ?? '');
$phone = mysqli_real_escape_string($con, $_POST['phone'] ?? '');
$status = mysqli_real_escape_string($con, $_POST['status'] ?? '');
$dob = mysqli_real_escape_string($con, $_POST['dob'] ?? '');
$typeID = isset($_POST['typeID']) ? (int) $_POST['typeID'] : 0;
$originalImageName = mysqli_real_escape_string($con, $_POST['originalImageName'] ?? '');
$imageName = $originalImageName;

// Validation
if ($contactID < 1 || $firstName === '' || $lastName === '' || $emailAddress === '' || $phone === '' || $status === '' || $dob === '' || $typeID < 1) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Check for duplicate email (excluding current contact)
$emailCheckQuery = "SELECT contactID FROM contacts WHERE emailAddress = '$emailAddress' AND contactID != $contactID LIMIT 1";
$emailCheckResult = mysqli_query($con, $emailCheckQuery);
if ($emailCheckResult && mysqli_num_rows($emailCheckResult) > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Email address already exists.']);
    exit;
}

// Handle image upload if a new one is provided
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    $newImageName = basename($_FILES['image']['name']);

    // Validate file type
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    $ext = strtolower(pathinfo($newImageName, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image type. Allowed: jpg, jpeg, png, gif.']);
        exit;
    }

    if ($newImageName !== 'placeholder_100.jpg') {
        $imageCheckQuery = "SELECT contactID FROM contacts WHERE imageName = '$newImageName' AND contactID != $contactID LIMIT 1";
        $imageCheckResult = mysqli_query($con, $imageCheckQuery);
        if ($imageCheckResult && mysqli_num_rows($imageCheckResult) > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'Image name already exists.']);
            exit;
        }
    }

    $targetFilePath = $uploadDir . $newImageName;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        if (!empty($originalImageName) && $originalImageName !== 'placeholder_100.jpg' && file_exists($uploadDir . $originalImageName)) {
            unlink($uploadDir . $originalImageName);
        }
        $imageName = $newImageName;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload image.']);
        exit;
    }
}

// ✅ Update contact including typeID
$sql = "UPDATE contacts SET 
            firstName = '$firstName',
            lastName = '$lastName',
            emailAddress = '$emailAddress',
            phone = '$phone',
            status = '$status',
            dob = '$dob',
            imageName = '$imageName',
            typeID = $typeID
        WHERE contactID = $contactID
        LIMIT 1";

if (mysqli_query($con, $sql)) {
    http_response_code(200);
    echo json_encode(['message' => 'Contact updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Database update failed']);
}
?>
