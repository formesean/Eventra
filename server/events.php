<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');          // CORS
header('Access-Control-Allow-Methods: GET,POST');  // Allowed methods
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // Fetch all events
  try {
    $query = $pdo->query("SELECT id, userId, name, description, startDate, endDate, location FROM event");
    $events = $query->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($events);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
}

elseif ($method === 'POST') {
  // Create a new event
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['name'], $data['startDate'], $data['endDate'], $data['userId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: name, startDate, endDate, userId']);
    exit;
  }

  try {
    $sql = "INSERT INTO event (userId, name, description, startDate, endDate, location)
            VALUES (:userId, :name, :description, :startDate, :endDate, :location)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':userId'     => $data['userId'],
      ':name'       => $data['name'],
      ':description'=> $data['description'] ?? '',
      ':startDate'  => $data['startDate'],
      ':endDate'    => $data['endDate'],
      ':location'   => $data['location'] ?? ''
    ]);

    http_response_code(201);
    echo json_encode(['event_id' => $pdo->lastInsertId()]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
}

else {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
}
