import fs from "fs";
import os from "os";

type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(currentUserName: string): void {
    const config = readConfig();
    config.currentUserName = currentUserName;
    writeConfig(config);
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();
    if (fs.existsSync(filePath)) {
        const readString = fs.readFileSync(filePath, "utf-8");
        const rawConfig = JSON.parse(readString);
        const config: Config = validateConfig(rawConfig);
        return config;
    }
    throw new Error("Config file not found. Please run 'gator init' to create a config file.");    
}

function getConfigFilePath(): string {
    return `${os.homedir()}/.gatorconfig.json`;
}

function writeConfig(config: Config): void {
    const filePath = getConfigFilePath();
    const rawConfig = { 
        db_url: config.dbUrl,
        current_user_name: config.currentUserName
    }
    fs.writeFileSync(filePath, JSON.stringify(rawConfig), "utf-8");
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("Invalid config: 'dbUrl' must be a string.");
    }    
    if (rawConfig.current_user_name && typeof rawConfig.current_user_name !== "string") {
        throw new Error("Invalid config: 'currentUserName' must be a string.");
    }
    const config: Config = { 
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    };
    return config;
}