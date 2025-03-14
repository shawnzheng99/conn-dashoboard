import { fetchRemoteData } from "./service/remoteData";
import { parseOpenVPNData } from "./utils/parseOpenVPN";
import { parseSSRData } from "./utils/parseSSR";
import styles from './styles/page.module.css'
import { convertToBeijingTime, formatBytes, removePortFrom } from "./utils/utils";
import Image from "next/image";
import { HOME_IP } from "@/secret";

export default async function Dashboard() {

    const openvpnRaw = await fetchRemoteData("openvpn");
    const ssrRaw = await fetchRemoteData("ssr");

    const openvpnClients = parseOpenVPNData(openvpnRaw);
    const ssrConnections = parseSSRData(ssrRaw);


    const lastUpdatedAt = new Date().toLocaleTimeString()

    return (
        <div className={styles.page}>
            <h1>CA-Root Server Dashboard</h1>
            <div className={styles.ctas}>
                <a
                    className={styles.primary}
                    href="/"
                >
                    <Image
                        className={styles.logo}
                        src="/vercel.svg"
                        alt="Vercel logomark"
                        width={10}
                        height={10}
                    />
                        Update
                </a>
                <span >Updated: {lastUpdatedAt}</span>
            </div>

            <main className={styles.main}>
                <h2>OpenVPN Clients</h2>
                <div className={styles["table-container"]}>
                    <table className={styles.table}>
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
                                <tr key={index}>
                                    <td>{client.commonName}</td>
                                    <td>{removePortFrom(client.realAddress)}</td>
                                    <td>{formatBytes(client.bytesReceived)}</td>
                                    <td>{formatBytes(client.bytesSent)}</td>
                                    <td>{convertToBeijingTime(client.connectedSince)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <div className={styles.main}>
                <h2>SSR Connections</h2>
                <div className={styles["table-container"]}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Local</th>
                                <th>From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ssrConnections.map((conn, index) => (
                                <tr 
                                    key={index} 
                                    className={!conn.peerAddress.includes(HOME_IP)? styles.warning: ''}
                                >
                                    <td>{removePortFrom(conn.localAddress)}</td>
                                    <td>{removePortFrom(conn.peerAddress)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

        </div>
    );
}
