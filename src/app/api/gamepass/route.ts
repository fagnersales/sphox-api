import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")
  if (!username) return NextResponse.json({ error: "Username not found in the search params" }, { status: 400 })

  return NextResponse.json({
    name: username,
    price: 1668,
    url: "https://roblox.com/fagnersales/1668"
  })
}
