<?php
session_start();
echo json_encode(['loggedIn' => isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] === true]);
?>
