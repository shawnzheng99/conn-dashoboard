import { fetchRemoteData } from "./service/remoteData";
import { parseOpenVPNData } from "./utils/parseOpenVPN";
import { parseSSRData } from "./utils/parseSSR";
import styles from './styles/page.module.css'
import { convertToBeijingTime, formatBytes } from "./utils/utils";

export default async function Dashboard() {
    // Fetch OpenVPN and SSR data
    const openvpnRaw = await fetchRemoteData("openvpn");
    const ssrRaw = await fetchRemoteData("ssr");

    // Parse data into structured objects
    const openvpnClients = parseOpenVPNData(openvpnRaw);
    const ssrConnections = parseSSRData(ssrRaw);

    return (
        <div className={styles.page}>
            <h1>VPN Dashboard</h1>
            <main className={styles.main}>
{/* OpenVPN Table */}
                <h2 className="text-xl font-semibold mb-2">OpenVPN Clients</h2>
                <table className="w-full border border-gray-400 mb-6 table-auto">
                    <thead>
                        <tr className={styles.secondary}>
                            <th className={styles.secondary}>Name</th>
                            <th className={styles.secondary}>SRC IP</th>
                            <th className={styles.secondary}>Received</th>
                            <th className={styles.secondary}>Sent</th>
                            <th className={styles.secondary}>Since</th>
                        </tr>
                    </thead>
                    <tbody>
                        {openvpnClients.map((client, index) => (
                            <tr key={index} className="border border-gray-400">
                                <td className="border border-gray-400 p-2">{client.commonName}</td>
                                <td className="border border-gray-400 p-2">{client.realAddress}</td>
                                <td className="border border-gray-400 p-2">{formatBytes(client.bytesReceived)}</td>
                                <td className="border border-gray-400 p-2">{formatBytes(client.bytesSent)}</td>
                                <td className="border border-gray-400 p-2">{convertToBeijingTime(client.connectedSince)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            <div className={styles.main}>

                {/* SSR Table */}
                <h2 className="text-xl font-semibold mb-2">SSR Connections</h2>
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 p-2">Local IP</th>
                            <th className="border border-gray-400 p-2">SRC IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ssrConnections.map((conn, index) => (
                            <tr key={index} className="border border-gray-400">
                                <td className="border border-gray-400 p-2">{conn.localAddress}</td>
                                <td className="border border-gray-400 p-2">{conn.peerAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            
        </div>
    );
}
