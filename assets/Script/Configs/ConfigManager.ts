import { JsonAsset, resources } from 'cc';
import { initializeConstants } from './GameConstants';

export class ConfigManager {
    public static config: any = null;

    public static async initAtPreview(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            resources.load('settings', JsonAsset, (err, jsonAsset) => {
                if (err) {
                    console.error('ConfigManager Error:', err.message || err);
                    reject();
                    return;
                }

                this.config = jsonAsset.json;
                initializeConstants(this.config);

                resolve();
            });
        });
    }

    public static async initAtBuild(): Promise<void> {
        try {
            const response = await fetch('settings.json');

            this.config = await response.json();
            initializeConstants(this.config);
        }
        catch (error) {
            console.error('Failed to fetch or parse settings.json:', error);
            this.config = {};
        }
    }
}


