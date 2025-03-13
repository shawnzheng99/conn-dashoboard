import { NextResponse } from "next/server";
import fs from "fs";


export const GET = async () => {
    try {
        const logPath = "/var/log/openvpn/status.log"; // Path to OpenVPN logs
        if (!fs.existsSync(logPath)) {
            return NextResponse.json({ error: "Log file not found" }, { status: 404 });
        }
        const data = fs.readFileSync(logPath, "utf8");
        return NextResponse.json({ status: data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to read OpenVPN log" }, { status: 500 });
    }
}
