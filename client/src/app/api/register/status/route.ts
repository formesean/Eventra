import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { userId, eventId, status } = data;

    if (!userId || !eventId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: userId, eventId and status",
        },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost/server/register.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ userId, eventId, status }),
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
