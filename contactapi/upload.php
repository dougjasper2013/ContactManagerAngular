<?php
    session_start();

    header('Content-Type: application/json');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require 'connect.php';

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK)
    {
        $uploadDir = 'uploads/';
        $originalFileName = basename($_FILES['image']['name']);

        // Generate a new file name with "Main"
        $newFileName = $originalFileName;
        $targetFilePath = $uploadDir . $newFileName;

        // Save the new image to the uploads directory
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath))
        {
            // no code required
        }
        else
        {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to upload image']);
        }

        exit; // Exit after handling image
    }
?>