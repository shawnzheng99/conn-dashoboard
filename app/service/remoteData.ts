import { exec } from "child_process";
import util from "util";
import {CA_ROOT_IP, SERVER_USER, STATUS_LOG_PATH, SSR_PORT, SSH_KEY} from '../../secret'

const execPromise = util.promisify(exec);

type ServiceTpye = "openvpn" | "ssr"

const SERVICE_TYPE: Record<ServiceTpye, string> = {
    openvpn: `ssh -i ${SSH_KEY} ${SERVER_USER}@${CA_ROOT_IP} "sudo cat ${STATUS_LOG_PATH}"`,
    ssr: `ssh -i ${SSH_KEY} ${SERVER_USER}@${CA_ROOT_IP} "ss -tn src :${SSR_PORT}"`,
}


export const fetchRemoteData = async (type: ServiceTpye): Promise<string> => {
    try {
        const sshCommand = SERVICE_TYPE[type];
        const { stdout } = await execPromise(sshCommand);
        return stdout;
    } catch (error) {
        console.error("Error fetching SSR connections:", error);
        return "Failed to fetch SSR connections";
    }
}