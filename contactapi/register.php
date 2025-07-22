<?php
require 'connect.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->userName, $data->password, $data->emailAddress)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$username = trim($data->userName);
$password = trim($data->password);
$email = trim($data->emailAddress);

// Check if username or email already exists
$check = $con->prepare("SELECT * FROM registrations WHERE userName = ? OR emailAddress = ?");
$check->bind_param("ss", $username, $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    exit;
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert the new user
$insert = $con->prepare("INSERT INTO registrations (userName, password, emailAddress) VALUES (?, ?, ?)");
$insert->bind_param("sss", $username, $hashedPassword, $email);

if ($insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error during registration']);
}
?>
