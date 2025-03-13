import { NextResponse } from "next/server";
import { fetchRemoteData } from "@/app/service/remoteData";
import { parseOpenVPNData } from "@/app/utils/parseOpenvpn";

export const GET = async () => {
    try {
        const data = await fetchRemoteData('openvpn')
        return NextResponse.json({ data: parseOpenVPNData(data) });
    } catch (error) {
        return NextResponse.json({ error: "Failed to read OpenVPN log" }, { status: 500 });
    }
}
