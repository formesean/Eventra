import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email && !id) {
    return NextResponse.json(
      { error: "Either email or id parameter is required" },
      { status: 400 }
    );
  }

  try {
    const queryParam = email ? `email=${email}` : `id=${id}`;
    const response = await fetch(
      `http://localhost/server/user.php?${queryParam}`,
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
