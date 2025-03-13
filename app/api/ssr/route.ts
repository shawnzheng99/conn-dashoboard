import { NextResponse } from "next/server";
import { exec } from "child_process";

// GET: Fetch all SSR connections
export const GET = async () => {
    return new Promise((resolve) => {
        exec("ss -tn src :8388", (err, stdout) => {
            if (err) {
                resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ connections: stdout }));
            }
        });
    });
}
