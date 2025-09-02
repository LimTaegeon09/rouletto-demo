import { _decorator, AudioClip, Component, director, find, Font, resources, screen, setDisplayStats, SpriteAtlas, tween, UIOpacity } from 'cc';
import { PREVIEW } from 'cc/env';
import { Assets } from '../Configs/Assets';
import { Console, moneyConfig } from '../Configs/Config';
import { ConfigManager } from '../Configs/ConfigManager';
import { GameConstants } from '../Configs/GameConstants';
import { WebSocketClient } from '../Network/WebSocketClient';
import { WebSocketMsg } from '../Network/WebSocketMsg';
import { sndType, SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('LoadSceneManager')
export class LoadSceneManager extends Component {

    private isLoaded: boolean = false;

    private readonly imageCnt: number = 11;
    private readonly fontCnt: number = 11;
    private readonly sceneCnt: number = 1;
    private readonly wsCnt: number = 1;
    private readonly sndCnt: number = Object.keys(sndType).length;
    private readonly loadingAnimCnt: number = 1;

    private readonly totalCnt: number = this.imageCnt + this.fontCnt + this.sceneCnt + this.wsCnt + this.sndCnt + this.loadingAnimCnt;
    private loadedCnt: number = 0;

    private blackOpacity: UIOpacity = null;

    onLoad() {
        setDisplayStats(false);

        this.blackOpacity = find('Canvas/UI/BlackSpr').getComponent(UIOpacity);
    }

    start() {
        this.initialize();
        this.startLoadingAnim();
    }

    update(deltaTime: number) {
        if (this.loadedCnt >= this.totalCnt) {
            if (!this.isLoaded) {
                this.isLoaded = true;
                this.moveScene();
            }
        }
    }

    private async initialize() {
        if (PREVIEW) await ConfigManager.initAtPreview();
        else await ConfigManager.initAtBuild();

        //Console.css("%cRouletto Demo Client v" + packageJson.version, 'color: #ffffff; background: #ff1493; font-weight: bold;');

        moneyConfig.credit = GameConstants.INITIAL_USER_CREDIT;

        if (PREVIEW) window.onresize();
        screen.windowSize = screen.windowSize;

        this.loadAssets();
        this.openWebsocket();
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
        Console.css("%cReceived data", 'color: #000000; background: #B8E7B8; font-weight: bold;', data);

        WebSocketClient.type = data['type'];
        WebSocketClient.data = data['data'];

        if (WebSocketClient.checkMsgType(WebSocketMsg.isConnected)) {
            this.loadedCnt++;
        }
    }

    private loadAssets() {
        /*****************************************************************
        00_Common
        *****************************************************************/
        resources.load('image/00_Common/chips', SpriteAtlas, (err, atlas) => {
            Assets.instance.chipsAtlas = atlas;
            this.loadedCnt++;
        });
        resources.load('image/00_Common/common', SpriteAtlas, (err, atlas) => {
            Assets.instance.commonAtlas = atlas;
            this.loadedCnt++;
        });
        resources.load('image/00_Common/history', SpriteAtlas, (err, atlas) => {
            Assets.instance.historyAtlas = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        01_BasicGame
        *****************************************************************/
        resources.load('image/01_BasicGame/basicGame', SpriteAtlas, (err, atlas) => {
            Assets.instance.basicAtlas = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        02_4winSumGame
        *****************************************************************/
        resources.load('image/02_4winSumGame/sumGame', SpriteAtlas, (err, atlas) => {
            Assets.instance.sumAtlas = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        03_JackPotGame
        *****************************************************************/
        resources.load('image/03_JackPotGame/jackpotGame', SpriteAtlas, (err, atlas) => {
            Assets.instance.jackpotAtlas = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        04_Livecam
        *****************************************************************/
        resources.load('image/04_Livecam/liveCam', SpriteAtlas, (err, atlas) => {
            Assets.instance.liveCamAtlas = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        05_Help
        *****************************************************************/
        resources.load('image/05_Help/help', SpriteAtlas, (err, atlas) => {
            Assets.instance.helpAtlas = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        06_Effect
        *****************************************************************/
        resources.load('image/06_Effect/effect', SpriteAtlas, (err, atlas) => {
            Assets.instance.effectAtlas = atlas;
            this.loadedCnt++;
        });
        resources.load('image/06_Effect/ngs0', SpriteAtlas, (err, atlas) => {
            Assets.instance.ngsAtlas0 = atlas;
            this.loadedCnt++;
        });
        resources.load('image/06_Effect/ngs1', SpriteAtlas, (err, atlas) => {
            Assets.instance.ngsAtlas1 = atlas;
            this.loadedCnt++;
        });

        /*****************************************************************
        Fonts
        *****************************************************************/
        resources.loadDir('fonts', Font, (err, font) => {
            font.forEach(e => {
                let name = '';
                for (let i = 0; i < e.name.length; i++) {
                    if (e.name[i].toUpperCase() == e.name[i]) {
                        name += e.name[i];
                    }
                }
                Assets.instance.fonts.set(name, e);
                this.loadedCnt++;
            });
        });

        /*****************************************************************
        Sounds
        *****************************************************************/
        resources.loadDir('sounds', AudioClip, (err, clips) => {
            if (err) {
                console.error('사운드 폴더 로드 실패:', err);
                return;
            }
            clips.forEach(clip => {
                SoundManager.instance.soundMap.set(clip.name, clip);
                this.loadedCnt++;
            });
        });

        /*****************************************************************
        Scene
        *****************************************************************/
        director.preloadScene("GameScene", () => {
            this.loadedCnt++;
        });
    }

    private moveScene() {
        director.loadScene("GameScene", () => {
            Console.css("%cMove scene", 'color: #000000; background: #FFD700; font-weight: bold;');
        });
    }

    private startLoadingAnim() {
        const loadingTween = tween(this.blackOpacity)
            .to(1, { opacity: 0 })
            .delay(2)
            .to(1, { opacity: 255 })
            .call(() => {
                this.loadedCnt++;
            })
            .start();
    }
}


