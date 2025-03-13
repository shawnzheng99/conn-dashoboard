export type SSRConnection = {
    localAddress: string;
    peerAddress: string;
};

export function parseSSRData(rawData: string): SSRConnection[] {
    const lines = rawData.split("\n");
    const connections: SSRConnection[] = [];

    for (const line of lines) {
        if (!line.startsWith("ESTAB")) continue; // Skip headers
        const values = line.trim().split(/\s+/);
        if (values.length < 5) continue; // Ensure valid line format

        connections.push({
            localAddress: values[3].trim(),
            peerAddress: values[4].trim(),
        });
    }

    return connections;
}