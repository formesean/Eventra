import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { success: false, error: "Missing required parameter: eventId" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://localhost/server/attendee.php?eventId=${eventId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response:", await response.text());
      return NextResponse.json(
        { success: false, error: "Invalid response from server" },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to fetch attendees" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { registrationId, status } = data;

    if (!registrationId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: registrationId and status",
        },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost/server/attendee.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ registrationId, status }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response:", await response.text());
      return NextResponse.json(
        { success: false, error: "Invalid response from server" },
        { status: 500 }
      );
    }

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || "Failed to update status",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error updating attendee status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const { registrationId } = data;

    if (!registrationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: registrationId",
        },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost/server/attendee.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ registrationId }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response:", await response.text());
      return NextResponse.json(
        { success: false, error: "Invalid response from server" },
        { status: 500 }
      );
    }

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || "Failed to delete registration",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error deleting attendee:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
