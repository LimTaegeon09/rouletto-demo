import { _decorator, Component, find, screen } from 'cc';
import { PREVIEW } from 'cc/env';
import { UIManager } from '../Components/UI/UIManager';
import { Console, isPlayableForPREVIEW } from '../Configs/Config';
import { GameConstants } from '../Configs/GameConstants';
import { WebSocketClient } from '../Network/WebSocketClient';
import { WebSocketMsg } from '../Network/WebSocketMsg';
const { ccclass, property } = _decorator;

@ccclass('GameSceneManager')
export class GameSceneManager extends Component {
    private uiManager: UIManager = null;

    protected onLoad(): void {
        screen.windowSize = screen.windowSize;

        WebSocketClient.instance.onmessage = (e) => {
            this.receiveCallback(JSON.parse(e.data));
        }
        WebSocketClient.instance.onclose = (e) => {
            Console.css("%cWebSocket Close", "color: #000000; background: #FFFFFF; font-weight: bold;");
            WebSocketClient.instance.is_open = false;
            this.scheduleOnce(() => {
                this.openWebsocket();
            }, GameConstants.WS_RECONNECTION_TIME);
        }

        ////////////////////////////////////////////

        this.uiManager = find('Canvas/UI').getComponent(UIManager);
    }

    protected start(): void {

    }

    private audioEnable(event, customEventData) {
        this.uiManager.commonBtn.setVolume(parseInt(customEventData));

        const interactionLayer = find('Canvas/UI').getChildByName('InteractionLayer');
        interactionLayer.active = false;
    }

    private openWebsocket() {
        WebSocketClient.open();
        WebSocketClient.instance.onopen = (e) => {
            WebSocketClient.instance.is_open = true;
        }
        WebSocketClient.instance.onmessage = (e) => {
            this.receiveCallback(JSON.parse(e.data));
        }
        WebSocketClient.instance.onclose = (e) => {
            Console.css("%cWebSocket Close", "color: #000000; background: #FFFFFF; font-weight: bold;");
            WebSocketClient.instance.is_open = false;
            this.scheduleOnce(() => {
                this.openWebsocket();
            }, GameConstants.WS_RECONNECTION_TIME);
        }
    }

    private receiveCallback(data: any) {
        if (PREVIEW && !isPlayableForPREVIEW) return;

        Console.css("%cReceived data", 'color: #000000; background: #B8E7B8; font-weight: bold;', data);

        WebSocketClient.type = data['type'];
        WebSocketClient.data = data['data'];

        if (WebSocketClient.checkMsgType(WebSocketMsg.gameStart)) {
            this.uiManager.gameStart();
        }

        else if (WebSocketClient.checkMsgType(WebSocketMsg.bettingEnd)) {
            this.uiManager.bettingEnd();
        }

        else if (WebSocketClient.checkMsgType(WebSocketMsg.spinBall)) {
            this.uiManager.spinBall();
        }

        else if (WebSocketClient.checkMsgType(WebSocketMsg.ballResults)) {
            this.uiManager.ballResults(data['data']);
        }

        else if (WebSocketClient.checkMsgType(WebSocketMsg.numberConfirm)) {
            this.uiManager.numberConfirm();
        }

        else if (WebSocketClient.checkMsgType(WebSocketMsg.gameEnd)) {
            this.uiManager.gameEnd();
        }

        else if (WebSocketClient.checkMsg(WebSocketMsg.errMainOpen) ||
            WebSocketClient.checkMsg(WebSocketMsg.errCasingOpen) ||
            WebSocketClient.checkMsg(WebSocketMsg.errDisconnect) ||
            WebSocketClient.checkMsg(WebSocketMsg.errBallNumberFail)) {
            this.uiManager.gameErr();
        }
    }
}


