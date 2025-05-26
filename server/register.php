<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // Check if userId and eventId are provided in the URL
  if (isset($_GET['userId']) && isset($_GET['eventId'])) {
    try {
      $query = $pdo->prepare("SELECT id, userId, eventId, fullName, email, contactNumber, status FROM registration WHERE userId = :userId AND eventId = :eventId");
      $query->execute([
        ':userId' => $_GET['userId'],
        ':eventId' => $_GET['eventId']
      ]);
      $registration = $query->fetch(PDO::FETCH_ASSOC);
      if ($registration) {
        echo json_encode([
          'isRegistered' => true,
          'registration' => $registration
        ]);
      } else {
        echo json_encode([
          'isRegistered' => false,
          'registration' => null
        ]);
      }
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(['error' => $e->getMessage()]);
    }
  } else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters: userId and eventId']);
  }
}

elseif ($method === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['userId'], $data['eventId'], $data['fullName'], $data['email'], $data['contactNumber'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: userId, eventId, fullName, email, contactNumber']);
    exit;
  }

  try {
    // Check if user exists
    $userCheck = $pdo->prepare("SELECT id FROM user WHERE id = :userId");
    $userCheck->execute([':userId' => $data['userId']]);
    if (!$userCheck->fetch()) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid userId: User does not exist']);
      exit;
    }

    // Check if event exists
    $eventCheck = $pdo->prepare("SELECT id, capacity, attendees FROM event WHERE id = :eventId");
    $eventCheck->execute([':eventId' => $data['eventId']]);
    $event = $eventCheck->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid eventId: Event does not exist']);
      exit;
    }

    // Check if event is at capacity
    if ($event['capacity'] !== null && $event['attendees'] >= $event['capacity']) {
      http_response_code(400);
      echo json_encode(['error' => 'Event is at full capacity']);
      exit;
    }

    // Check for duplicate registration
    $duplicateCheck = $pdo->prepare("SELECT id FROM registration WHERE userId = :userId AND eventId = :eventId");
    $duplicateCheck->execute([
      ':userId' => $data['userId'],
      ':eventId' => $data['eventId']
    ]);
    if ($duplicateCheck->fetch()) {
      http_response_code(400);
      echo json_encode(['error' => 'You have already registered for this event']);
      exit;
    }

    // Insert registration
    $sql = "INSERT INTO registration (userId, eventId, fullName, email, contactNumber, createdAt, updatedAt)
            VALUES (:userId, :eventId, :fullName, :email, :contactNumber, NOW(), NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':userId' => $data['userId'],
      ':eventId' => $data['eventId'],
      ':fullName' => $data['fullName'],
      ':email' => $data['email'],
      ':contactNumber' => $data['contactNumber']
    ]);

      // Update event attendees count and goingCount
      $updateEvent = $pdo->prepare("UPDATE event SET attendees = attendees + 1, goingCount = goingCount + 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);

      // Commit transaction
      $pdo->commit();

      http_response_code(201);
      echo json_encode([
        'success' => true,
        'message' => 'Successfully registered for the event',
        'registration_id' => $pdo->lastInsertId()
      ]);
    } catch (PDOException $e) {
      // Rollback transaction on error
      $pdo->rollBack();
      http_response_code(500);
      echo json_encode(['error' => $e->getMessage()]);
    }
}
