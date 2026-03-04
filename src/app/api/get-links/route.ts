import { NextRequest, NextResponse } from "next/server";
import { discoverPages } from "@/app/actions/crawl";

export async function POST(req: NextRequest) {
    const { url, accessToken } = await req.json() as { url: string; accessToken: string };

    if (!url || !accessToken) {
        return NextResponse.json({ error: "Missing url or accessToken" }, { status: 400 });
    }

    const result = await discoverPages(url, accessToken);
    return NextResponse.json(result);
}
