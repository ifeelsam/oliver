import { NextResponse } from "next/server";

/**
 * Circle Wallet Authentication Endpoint
 * 
 * This endpoint should:
 * 1. Authenticate your user (via your auth system)
 * 2. Call Circle's API to create/get a user token
 * 3. Return the userToken and encryptionKey to the frontend
 * 
 * IMPORTANT: You need to set up Circle API credentials first:
 * - Sign up at https://console.circle.com
 * - Get your API Key from the dashboard
 * - Add CIRCLE_API_KEY to your .env file
 */

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.CIRCLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                {
                    error: "Circle API key not configured",
                    setup: "Add CIRCLE_API_KEY to your .env file. Get it from https://console.circle.com"
                },
                { status: 500 }
            );
        }

        // Step 1: Call Circle's API to initialize user
        // Documentation: https://developers.circle.com/w3s/reference/createuser
        const circleResponse = await fetch(
            "https://api.circle.com/v1/w3s/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    userId: userId,
                }),
            }
        );

        if (!circleResponse.ok) {
            const errorData = await circleResponse.json();
            console.error("Circle API error:", errorData);
            return NextResponse.json(
                { error: "Failed to create Circle user", details: errorData },
                { status: circleResponse.status }
            );
        }

        const userData = await circleResponse.json();

        // Step 2: Acquire session token
        // Documentation: https://developers.circle.com/w3s/reference/createsessiontoken
        const sessionResponse = await fetch(
            "https://api.circle.com/v1/w3s/users/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    userId: userId,
                }),
            }
        );

        if (!sessionResponse.ok) {
            const errorData = await sessionResponse.json();
            console.error("Circle session error:", errorData);
            return NextResponse.json(
                { error: "Failed to create session", details: errorData },
                { status: sessionResponse.status }
            );
        }

        const sessionData = await sessionResponse.json();

        // Step 3: Return tokens to frontend
        return NextResponse.json({
            userToken: sessionData.data.userToken,
            encryptionKey: sessionData.data.encryptionKey,
            userId: userId,
        });

    } catch (error: any) {
        console.error("Circle auth error:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}
