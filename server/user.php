<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');          // CORS
header('Access-Control-Allow-Methods: GET,POST');  // Allowed methods
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

error_reporting(0);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $email = $_GET['email'] ?? null;
  $id = $_GET['id'] ?? null;

  try {
    if ($email) {
      $stmt = $pdo->prepare("SELECT id, name, email FROM user WHERE email = :email");
      $stmt->execute([':email' => $email]);
    } else if ($id) {
      $stmt = $pdo->prepare("SELECT id, name, email FROM user WHERE id = :id");
      $stmt->execute([':id' => $id]);
    } else {
      $stmt = $pdo->query("SELECT id, name, email FROM user");
    }
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($users);
  } catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage()); // Log the error
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error']);
  }
} else if ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required field: email']);
    exit;
  }

  try {
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM user WHERE email = :email");
    $stmt->execute([':email' => $data['email']]);
    $user = $stmt->fetch();

    if ($user) {
      // Update existing user
      $sql = "UPDATE user SET name = :name WHERE email = :email";
    } else {
      // Insert new user
      $sql = "INSERT INTO user (email, name) VALUES (:email, :name)";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':email' => $data['email'],
      ':name'  => $data['name'] ?? '',
    ]);

    http_response_code(200);
    echo json_encode(['success' => true]);
  } catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage()); // Log the error
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error']);
  }
} else {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
}
