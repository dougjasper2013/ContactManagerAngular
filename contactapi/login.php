<?php
require 'connect.php';

session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->userName, $data->password)) {
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

$username = trim($data->userName);
$password = trim($data->password);

// Fetch the user record
$query = $con->prepare("SELECT * FROM registrations WHERE userName = ?");
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        $_SESSION['loggedIn'] = true;
        $_SESSION['username'] = $username;

        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
?>
