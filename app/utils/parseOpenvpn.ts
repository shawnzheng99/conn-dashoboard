export type OpenVPNClient = {
    commonName: string;
    realAddress: string;
    bytesReceived: number;
    bytesSent: number;
    connectedSince: string;
};

export type OpenVPNRoute = {
    virtualAddress: string;
    commonName: string;
    realAddress: string;
    lastRef: string;
};

export function parseOpenVPNData(rawData: string): {
    clients: OpenVPNClient[];
    routes: OpenVPNRoute[];
} {
    const lines = rawData.split("\n");
    const clients: OpenVPNClient[] = [];
    const routes: OpenVPNRoute[] = [];
    
    let section: "clients" | "routes" | null = null;

    for (const line of lines) {
        if (line.startsWith("Common Name")) {
            section = "clients";
            continue;
        }
        if (line.startsWith("ROUTING TABLE")) {
            section = "routes";
            continue;
        }
        if (line.startsWith("GLOBAL STATS") || line.startsWith("END")) {
            break; // Stop processing after important sections
        }
        if (!line.trim() || !section) continue; // Skip empty lines

        const values = line.split(",");

        if (section === "clients" && values.length === 5) {
            clients.push({
                commonName: values[0].trim(),
                realAddress: values[1].trim(),
                bytesReceived: parseInt(values[2].trim(), 10),
                bytesSent: parseInt(values[3].trim(), 10),
                connectedSince: values[4].trim(),
            });
        }

        if (section === "routes" && values.length === 4) {
            routes.push({
                virtualAddress: values[0].trim(),
                commonName: values[1].trim(),
                realAddress: values[2].trim(),
                lastRef: values[3].trim(),
            });
        }
    }

    return { clients, routes };
}