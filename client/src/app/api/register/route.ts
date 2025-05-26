import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const eventId = searchParams.get("eventId");

  if (!userId || !eventId) {
    return NextResponse.json(
      { error: "Both userId and eventId parameters are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://localhost/server/register.php?userId=${userId}&eventId=${eventId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, eventId, fullName, email, contactNumber } = body;

    // Validate required fields
    if (!userId || !eventId || !fullName || !email || !contactNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call PHP registration endpoint
    const response = await fetch(`http://localhost/server/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventId,
        fullName,
        email,
        contactNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully registered for the event",
      registration_id: data.registration_id,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
