export type OpenVPNRoute = {
    virtualAddress: string;
    lastRef: string;
};

export type OpenVPNClient = {
    commonName: string;
    realAddress: string;
    bytesReceived: number;
    bytesSent: number;
    connectedSince: string;
    routes: OpenVPNRoute[]; // Routes specific to this client
};

export function parseOpenVPNData(rawData: string): OpenVPNClient[] {
    const lines = rawData.split("\n");
    const clients: OpenVPNClient[] = [];
    const clientMap: Record<string, OpenVPNClient> = {}; // Map to link clients to routes
    
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
            const client: OpenVPNClient = {
                commonName: values[0].trim(),
                realAddress: values[1].trim(),
                bytesReceived: parseInt(values[2].trim(), 10),
                bytesSent: parseInt(values[3].trim(), 10),
                connectedSince: values[4].trim(),
                routes: [] // Initialize empty route array
            };
            clients.push(client);
            clientMap[client.commonName] = client; // Store reference for linking routes
        }

        if (section === "routes" && values.length === 4) {
            const [virtualAddress, commonName, realAddress, lastRef] = values.map(v => v.trim());

            if (clientMap[commonName]) {
                clientMap[commonName].routes.push({
                    virtualAddress,
                    lastRef
                });
            }
        }
    }

    return clients;
}