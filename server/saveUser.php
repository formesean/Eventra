<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
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
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
} else {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
}
