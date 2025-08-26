import { PREVIEW } from "cc/env";
import { Console } from "../Configs/Config";
import { GameConstants } from "../Configs/GameConstants";

export class WebSocketClient extends WebSocket {
    private static _instance: WebSocketClient;

    public is_open: boolean = false;

    public static type: string = '';
    public static data: string = '';

    private constructor(url: string) {
        super(url);
    }

    public static open = () => {
        return new Promise<void>((resolve, reject) => {
            try {
                if (this._instance) { this.close(); }
                if (PREVIEW) { }
                this._instance = new this(GameConstants.WEBSOCKET_URL);
                Console.css("%cWebSocket Open", "color: #000000; background: #FFFFFF; font-weight: bold;", GameConstants.WEBSOCKET_URL);
                resolve();
            }
            catch (e) {
                reject();
            }
        });
    }

    public static close = () => {
        this._instance.close();
        delete this._instance;
    }

    public sendMsg(data: any) {
        if (this.is_open) {
            try {
                super.send(JSON.stringify(data));
                Console.css("%cSended data", "color: #000000; background: #D0E8FF; font-weight: bold;", data);
            }
            catch (e) {
                Console.css("%cFail sended data", "color: #000000; background: #FFFFFF; font-weight: bold;", e);
            }
        }
    }

    public onerror = (e) => {
        Console.css("%cWebSocket Error", "color: #000000; background: #FFFFFF; font-weight: bold;", e);
    }

    public static checkMsgType(msg: any) {
        return (WebSocketClient.type === msg['type']);
    }

    public static checkMsg(msg: any) {
        return (WebSocketClient.type === msg['type'] && WebSocketClient.data === msg['data']);
    }

    public static get instance() {
        return this._instance;
    }



}


