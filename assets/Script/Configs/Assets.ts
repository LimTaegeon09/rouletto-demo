import { _decorator, Font, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Assets')
export class Assets {
    private static _instance: Assets = null;

    //!------------------------------------

    public chipsAtlas: SpriteAtlas = null;
    public commonAtlas: SpriteAtlas = null;
    public historyAtlas: SpriteAtlas = null;

    public basicAtlas: SpriteAtlas = null;
    public sumAtlas: SpriteAtlas = null;
    public jackpotAtlas: SpriteAtlas = null;
    public liveCamAtlas: SpriteAtlas = null;
    public helpAtlas: SpriteAtlas = null;
    public effectAtlas: SpriteAtlas = null;

    //!------------------------------------

    public fonts: Map<string, Font> = new Map();

    //!------------------------------------

    public static get instance() {
        if (!this._instance) this._instance = new Assets();
        return this._instance;
    }
}


