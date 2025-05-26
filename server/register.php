<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,PUT, DELETE');
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

  if (!isset($data['userId'], $data['eventId'], $data['fullName'], $data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: userId, eventId, fullName, email']);
    exit;
  }

  try {
    $pdo->beginTransaction();

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
      ':contactNumber' => $data['contactNumber'] ?? null
    ]);

    // Update event attendees count
    $updateEvent = $pdo->prepare("UPDATE event SET attendees = attendees + 1, goingCount = goingCount + 1 WHERE id = :eventId");
    $updateEvent->execute([':eventId' => $data['eventId']]);
    $pdo->commit();

    http_response_code(201);
    echo json_encode([
      'success' => true,
      'message' => 'Successfully registered for the event',
      'registration_id' => $pdo->lastInsertId()
    ]);
  } catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
      'error' => 'Database error occurred',
      'details' => $e->getMessage()
    ]);
  }
}

elseif ($method === 'PUT') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['userId'], $data['eventId'], $data['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: userId, eventId and status']);
    exit;
  }

  $validStatuses = ['going', 'maybe', 'not-going'];
  if (!in_array($data['status'], $validStatuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid status value. Must be one of: going, maybe, not-going']);
    exit;
  }

  try {
    $pdo->beginTransaction();

    $currentStatusQuery = $pdo->prepare("SELECT id, status FROM registration WHERE userId = :userId AND eventId = :eventId");
    $currentStatusQuery->execute([
      ':userId' => $data['userId'],
      ':eventId' => $data['eventId']
    ]);
    $currentRegistration = $currentStatusQuery->fetch(PDO::FETCH_ASSOC);

    if (!$currentRegistration) {
      http_response_code(404);
      echo json_encode(['error' => 'Registration not found']);
      exit;
    }

    // Update registration status
    $updateQuery = $pdo->prepare("UPDATE registration SET status = :status, updatedAt = NOW() WHERE id = :registrationId");
    $updateQuery->execute([
      ':status' => $data['status'],
      ':registrationId' => $currentRegistration['id']
    ]);

    // Update event counts based on status changes
    $oldStatus = $currentRegistration['status'];
    $newStatus = $data['status'];

    if ($oldStatus === 'going') {
      $updateEvent = $pdo->prepare("UPDATE event SET goingCount = goingCount - 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    } elseif ($oldStatus === 'maybe') {
      $updateEvent = $pdo->prepare("UPDATE event SET maybeCount = maybeCount - 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    } elseif ($oldStatus === 'not-going') {
      $updateEvent = $pdo->prepare("UPDATE event SET notGoingCount = notGoingCount - 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    }

    if ($newStatus === 'going') {
      $updateEvent = $pdo->prepare("UPDATE event SET goingCount = goingCount + 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    } elseif ($newStatus === 'maybe') {
      $updateEvent = $pdo->prepare("UPDATE event SET maybeCount = maybeCount + 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    } elseif ($newStatus === 'not-going') {
      $updateEvent = $pdo->prepare("UPDATE event SET notGoingCount = notGoingCount + 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    }

    $pdo->commit();

    echo json_encode([
      'success' => true,
      'message' => 'Status updated successfully'
    ]);
  } catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
      'error' => 'Database error occurred',
      'details' => $e->getMessage()
    ]);
  }
}

elseif ($method === 'DELETE') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['userId'], $data['eventId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: userId and eventId']);
    exit;
  }

  try {
    $pdo->beginTransaction();

    $currentStatusQuery = $pdo->prepare("SELECT id, status FROM registration WHERE userId = :userId AND eventId = :eventId");
    $currentStatusQuery->execute([
      ':userId' => $data['userId'],
      ':eventId' => $data['eventId']
    ]);
    $currentRegistration = $currentStatusQuery->fetch(PDO::FETCH_ASSOC);

    if (!$currentRegistration) {
      http_response_code(404);
      echo json_encode(['error' => 'Registration not found']);
      exit;
    }

    // Update event counts based on current status
    $status = $currentRegistration['status'];
    if ($status === 'going') {
      $updateEvent = $pdo->prepare("UPDATE event SET goingCount = goingCount - 1, attendees = attendees - 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    } elseif ($status === 'maybe') {
      $updateEvent = $pdo->prepare("UPDATE event SET maybeCount = maybeCount - 1, attendees = attendees - 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    } elseif ($status === 'not-going') {
      $updateEvent = $pdo->prepare("UPDATE event SET notGoingCount = notGoingCount - 1, attendees = attendees - 1 WHERE id = :eventId");
      $updateEvent->execute([':eventId' => $data['eventId']]);
    }

    // Delete the registration
    $deleteQuery = $pdo->prepare("DELETE FROM registration WHERE id = :registrationId");
    $deleteQuery->execute([':registrationId' => $currentRegistration['id']]);

    $pdo->commit();

    echo json_encode([
      'success' => true,
      'message' => 'Registration cancelled successfully'
    ]);
  } catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
      'error' => 'Database error occurred',
      'details' => $e->getMessage()
    ]);
  }
}
