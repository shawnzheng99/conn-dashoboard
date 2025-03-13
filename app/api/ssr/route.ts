import { NextResponse } from "next/server";
import { fetchRemoteData } from "@/app/service/remoteData";
import { parseSSRData } from "@/app/utils/parseSSR";

export const GET = async () => {
    try {
        const data = await fetchRemoteData('ssr')
        return NextResponse.json({ data: parseSSRData(data) });
    } catch (error) {
        return NextResponse.json({ error: "Failed to read OpenVPN log" }, { status: 500 });
    }
}
