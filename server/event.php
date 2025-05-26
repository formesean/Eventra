<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST,PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // Check if an ID is provided in the URL
  if (isset($_GET['id'])) {
    $id = $_GET['id'];
    try {
      $query = $pdo->prepare("SELECT id, userId, name, description, startDate, endDate, location, attendees, goingCount, maybeCount, notGoingCount, organizer, capacity, endTime, hasCapacity, hasTickets, isFree, requiresApproval, startTime, timezone, bannerUrl FROM event WHERE id = :id");
      $query->execute([':id' => $id]);
      $event = $query->fetch(PDO::FETCH_ASSOC);
      if ($event) {
        echo json_encode($event);
      } else {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
      }
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(['error' => $e->getMessage()]);
    }
  } else {
    // Fetch all events
    try {
      $query = $pdo->query("SELECT id, userId, name, description, startDate, endDate, location, attendees, goingCount, maybeCount, notGoingCount, organizer, capacity, endTime, hasCapacity, hasTickets, isFree, requiresApproval, startTime, timezone, bannerUrl FROM event");
      $events = $query->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($events);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(['error' => $e->getMessage()]);
    }
  }
}

elseif ($method === 'POST') {
  // Create a new event
  $data = json_decode(file_get_contents('php://input'), true);

  if (isset($data['eventName'])) {
    $data['name'] = $data['eventName'];
  }

  if (!isset($data['eventName'], $data['startDate'], $data['endDate'], $data['userId'], $data['startTime'], $data['endTime'], $data['organizer'], $data['attendees'], $data['selectedBanner'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: eventName, startDate, endDate, userId, startTime, endTime, organizer, attendees, selectedBanner']);
    exit;
  }

  try {
    $userCheck = $pdo->prepare("SELECT id FROM user WHERE id = :userId");
    $userCheck->execute([':userId' => $data['userId']]);
    if (!$userCheck->fetch()) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid userId: User does not exist']);
      exit;
    }

    $sql = "INSERT INTO event (userId, name, description, startDate, endDate, location, attendees, goingCount, maybeCount, notGoingCount, organizer, capacity, endTime, hasCapacity, hasTickets, isFree, requiresApproval, startTime, timezone, bannerUrl)
            VALUES (:userId, :name, :description, :startDate, :endDate, :location, :attendees, :goingCount, :maybeCount, :notGoingCount, :organizer, :capacity, :endTime, :hasCapacity, :hasTickets, :isFree, :requiresApproval, :startTime, :timezone, :bannerUrl)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':userId'           => $data['userId'],
      ':name'             => $data['name'],
      ':description'      => $data['description'] ?? '',
      ':startDate'        => $data['startDate'],
      ':endDate'          => $data['endDate'],
      ':location'         => $data['location'] ?? '',
      ':attendees'        => $data['attendees'],
      ':goingCount'       => 0,
      ':maybeCount'       => 0,
      ':notGoingCount'    => 0,
      ':organizer'        => $data['organizer'],
      ':capacity'         => $data['capacity'] ?? null,
      ':endTime'          => $data['endTime'],
      ':hasCapacity'      => $data['hasCapacity'] ?? false,
      ':hasTickets'       => $data['hasTickets'] ?? false,
      ':isFree'           => $data['isFree'] ?? true,
      ':requiresApproval' => $data['requiresApproval'] ?? false,
      ':startTime'        => $data['startTime'],
      ':timezone'         => $data['timezone'] ?? null,
      ':bannerUrl'        => $data['selectedBanner'] ?? '/stock-banner-1.jpg',
    ]);

    http_response_code(201);
    echo json_encode(['event_id' => $pdo->lastInsertId()]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
}

elseif ($method === 'PUT') {
  // Update an existing event
  $data = json_decode(file_get_contents('php://input'), true);
  $id = $_GET['id'] ?? null;

  if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event ID']);
    exit;
  }

  if (isset($data['eventName'])) {
    $data['name'] = $data['eventName'];
  }

  try {
    $eventCheck = $pdo->prepare("SELECT id FROM event WHERE id = :id");
    $eventCheck->execute([':id' => $id]);
    if (!$eventCheck->fetch()) {
      http_response_code(404);
      echo json_encode(['error' => 'Event not found']);
      exit;
    }

    if (!isset($data['name'], $data['startDate'], $data['endDate'], $data['startTime'], $data['endTime'], $data['organizer'], $data['attendees'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    $sql = "UPDATE event SET
            name = :name,
            description = :description,
            startDate = :startDate,
            endDate = :endDate,
            location = :location,
            attendees = :attendees,
            goingCount = :goingCount,
            maybeCount = :maybeCount,
            notGoingCount = :notGoingCount,
            organizer = :organizer,
            capacity = :capacity,
            endTime = :endTime,
            hasCapacity = :hasCapacity,
            hasTickets = :hasTickets,
            isFree = :isFree,
            requiresApproval = :requiresApproval,
            startTime = :startTime,
            timezone = :timezone,
            bannerUrl = :bannerUrl
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
      ':id'               => $id,
      ':name'             => $data['name'],
      ':description'      => $data['description'] ?? '',
      ':startDate'        => $data['startDate'],
      ':endDate'          => $data['endDate'],
      ':location'         => $data['location'] ?? '',
      ':attendees'        => $data['attendees'],
      ':goingCount'       => $data['goingCount'] ?? 0,
      ':maybeCount'       => $data['maybeCount'] ?? 0,
      ':notGoingCount'    => $data['notGoingCount'] ?? 0,
      ':organizer'        => $data['organizer'],
      ':capacity'         => $data['capacity'] ?? null,
      ':endTime'          => $data['endTime'],
      ':hasCapacity'      => $data['hasCapacity'] ?? false,
      ':hasTickets'       => $data['hasTickets'] ?? false,
      ':isFree'           => $data['isFree'] ?? true,
      ':requiresApproval' => $data['requiresApproval'] ?? false,
      ':startTime'        => $data['startTime'],
      ':timezone'         => $data['timezone'] ?? null,
      ':bannerUrl'        => $data['selectedBanner'] ?? '/stock-banner-1.jpg',
    ]);

    if ($result) {
      http_response_code(200);
      echo json_encode([
        'message' => 'Event updated successfully',
        'eventId' => $id
      ]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Failed to update event']);
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
}

else {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
}
