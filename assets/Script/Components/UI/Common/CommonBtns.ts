import { _decorator, Button, Component, Label, macro, Node, Sprite, Toggle, ToggleContainer } from 'cc';
import { gameConfig, panelState, volumeState } from '../../../Configs/Config';
import { GameConstants } from '../../../Configs/GameConstants';
import { creatEventHandler, formatNumber } from '../../../Utils/Utils';
import { EventManager, evtFunc, evtNode } from '../../EventManager';
import { CommonManager } from './CommonManager';
const { ccclass, property } = _decorator;

@ccclass('CommonBtns')
export class CommonBtns extends Component {
    private commonManager: CommonManager = null;

    private basicToggle: Toggle = null;
    private fourSumToggle: Toggle = null;
    private jackpotToggle: Toggle = null;

    private liveToggle: Toggle = null;
    private sndBtnNode: Node = null;

    private autoToggleNode: Node = null;
    private denomToggles: Array<Toggle> = [];
    private chipBtnNodes: Array<Node> = [];
    private chipOverSprNode: Node = null;

    private clearBtn: Button = null;
    private doubleBtn: Button = null;
    private reBetBtn: Button = null;
    private undoBtn: Button = null;

    private toggleArr: Toggle[] = [];
    private currentIndex: number = 0;

    protected onLoad(): void {
        this.commonManager = this.node.getComponent(CommonManager);

        const top = this.node.getChildByName('Top');
        const bottom = this.node.getChildByName('Bottom');

        const leftBtns = top.getChildByName('LeftBtns');
        const rightBtns = top.getChildByName('RightBtns');

        const denom = bottom.getChildByName('Denom');
        const denomBtns = denom.getChildByName('Btns');

        const betBtns = bottom.getChildByName('BetBtns');

        this.basicToggle = leftBtns.getChildByName('BasicToggle').getComponent(Toggle);
        this.fourSumToggle = leftBtns.getChildByName('SumToggle').getComponent(Toggle);
        this.jackpotToggle = leftBtns.getChildByName('JackpotToggle').getComponent(Toggle);

        this.liveToggle = rightBtns.getChildByName('LiveToggle').getComponent(Toggle);
        this.sndBtnNode = rightBtns.getChildByName('SoundBtn');

        this.autoToggleNode = bottom.getChildByName('AutoReBet').getChildByName('Toggle');
        denomBtns.children.forEach(c => {
            this.denomToggles.push(c.getComponent(Toggle));
        });
        for (let i = 0; i < 7; i++) {
            this.chipBtnNodes.push(bottom.getChildByName('Chips').children[i]);
        }
        this.chipOverSprNode = bottom.getChildByName('Chips').getChildByName('OverSpr');

        this.clearBtn = betBtns.getChildByName('ClearBtn').getComponent(Button);
        this.doubleBtn = betBtns.getChildByName('DoubleBtn').getComponent(Button);
        this.reBetBtn = betBtns.getChildByName('ReBtn').getComponent(Button);
        this.undoBtn = betBtns.getChildByName('UndoBtn').getComponent(Button);

        /////////////////////////////////////////////////////////////////////////////////

        this.basicToggle.checkEvents.push(creatEventHandler(this.node, this, 'togglePanel', panelState.basic));
        this.fourSumToggle.checkEvents.push(creatEventHandler(this.node, this, 'togglePanel', panelState.fourSum));
        this.jackpotToggle.checkEvents.push(creatEventHandler(this.node, this, 'togglePanel', panelState.jackpot));

        this.liveToggle.checkEvents.push(creatEventHandler(this.node, this, 'toggleStreaming'));
        this.sndBtnNode.getComponent(Button).clickEvents.push(creatEventHandler(this.node, this, 'clickVolume'));

        this.autoToggleNode.getComponent(Toggle).clickEvents.push(creatEventHandler(this.node, this, 'toggleAuto'));
        this.denomToggles.forEach((d, i) => {
            d.clickEvents.push(creatEventHandler(this.node, this, 'clickDenom', i));
        });
        this.chipBtnNodes.forEach((c, i) => {
            c.getComponent(Button).clickEvents.push(creatEventHandler(this.node, this, 'clickChip', i));
        });

        this.clearBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickClearBtn'));
        this.doubleBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickDoubleBtn'));
        this.reBetBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickReBetBtn'));
        this.undoBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickUndoBtn'));

    }

    start() {
        this.chipBtnNodes.forEach((c, i) => {
            c.getChildByName('Label').getComponent(Label).string = formatNumber(GameConstants.CHIP_VALUES[i]);
        });

        this.toggleArr = [this.basicToggle, this.fourSumToggle, this.jackpotToggle];

        this.setSndSprite(gameConfig.volume);

        ////////////////////////

        this.initPanelToggle();
    }

    private togglePanel(event, customEventData) {
        const isChecked = event.target.getComponent(Toggle).isChecked;
        if (isChecked) {
            if (gameConfig.panel == customEventData) return;
        }

        let spriteFrameName;

        switch (customEventData) {
            case panelState.basic:
                emit(evtNode.basicPanel, evtFunc.setPanelActive, isChecked);
                spriteFrameName = 'BG_Basic';
                break;
            case panelState.fourSum:
                emit(evtNode.fourSumPanel, evtFunc.setPanelActive, isChecked);
                spriteFrameName = 'BG_FourSum';
                break;
            case panelState.jackpot:
                emit(evtNode.jackpotPanel, evtFunc.setPanelActive, isChecked);
                spriteFrameName = 'BG_Jackpot';
                break;
        }
        if (isChecked) {
            gameConfig.panel = customEventData;
            this.commonManager.setBgSpr(spriteFrameName);
            this.setStreamingBtn(false);
        }
    }

    private toggleStreaming(event, customEventData) {
        const isChecked = event.target.getComponent(Toggle).isChecked;
        emit(evtNode.streamingPopup, evtFunc.setPopupActive, isChecked);
    }

    private clickVolume() {
        this.setSndSprite();
    }

    private setSndSprite(volumeIndex?: number) {
        if (volumeIndex != null) gameConfig.volume = volumeIndex;
        else gameConfig.volume++;

        if (gameConfig.volume > volumeState.high) gameConfig.volume = volumeState.off;

        let spriteFrameName = 'btn_sound_off';

        switch (gameConfig.volume) {
            case volumeState.low:
                spriteFrameName = 'btn_sound_on1';
                break;
            case volumeState.mid:
                spriteFrameName = 'btn_sound_on2';
                break;
            case volumeState.high:
                spriteFrameName = 'btn_sound_on3';
                break;
        }
        const sndSpr = this.sndBtnNode.getComponent(Sprite);
        sndSpr.spriteFrame = sndSpr.spriteAtlas.getSpriteFrame(spriteFrameName);
    }

    private toggleAuto(event, customEventData) {
        const isChecked = !event.target.getComponent(Toggle).isChecked;

        let spriteFrameName = 'btn_Auto_rebet_off';
        if (isChecked) spriteFrameName = 'btn_Auto_rebet_on';

        const autoSpr = this.autoToggleNode.getComponent(Sprite);
        autoSpr.spriteFrame = autoSpr.spriteAtlas.getSpriteFrame(spriteFrameName);

        gameConfig.isAutoReBet = isChecked;


        //!----- for Test -----!//
        /*
        if (isChecked) {
            const ran = pickRandomNumbers();
            emit(evtFunc.ballResults, [1, 2, 3, 4]);
        }
        else {
            emit(evtFunc.gameEnd);
        }
        */
        //!--------------------!//
    }

    private clickDenom(event, customEventData) {
        switch (parseInt(customEventData)) {
            case 0:
                gameConfig.denom = 1;
                break;
            case 1:
                gameConfig.denom = 2;
                break;
            case 2:
                gameConfig.denom = 5;
                break;
            case 3:
                gameConfig.denom = 10;
                break;
        }
        gameConfig.currentBet = gameConfig.chip * gameConfig.denom;
    }

    private clickChip(event, customEventData) {
        const index = parseInt(customEventData);

        this.chipOverSprNode.setPosition(this.chipBtnNodes[index].getPosition());
        this.chipOverSprNode.active = true;

        gameConfig.chip = GameConstants.CHIP_VALUES[index];
        gameConfig.currentBet = gameConfig.chip * gameConfig.denom;
    }

    private initPanelToggle() {
        this.basicToggle.isChecked = false;
        this.fourSumToggle.isChecked = false;
        this.jackpotToggle.isChecked = false;

        emit(evtNode.basicPanel, evtFunc.setPanelActive, false);
        emit(evtNode.fourSumPanel, evtFunc.setPanelActive, false);
        emit(evtNode.jackpotPanel, evtFunc.setPanelActive, false);

        const panel = gameConfig.panel;
        gameConfig.panel = null;

        switch (panel) {
            case panelState.basic:
                this.basicToggle.isChecked = true;
                break;
            case panelState.fourSum:
                this.fourSumToggle.isChecked = true;
                break;
            case panelState.jackpot:
                this.jackpotToggle.isChecked = true;
                break;
        }

        this.basicToggle.node.parent.getComponent(ToggleContainer).allowSwitchOff = false;
    }

    public setStreamingBtn(is: boolean) {
        this.liveToggle.isChecked = is;
    }

    private clickClearBtn(event, customEventData) {
        if (!gameConfig.isBettable) return;

        switch (gameConfig.panel) {
            case panelState.basic:
                emit(evtFunc.clearBasic);
                break;

            case panelState.fourSum:
                emit(evtFunc.clearFourSum);
                break;

            case panelState.jackpot:
                emit(evtFunc.clearJackpot);
                break;
        }
    }

    private clickDoubleBtn(event, customEventData) {
        if (!gameConfig.isBettable) return;

        switch (gameConfig.panel) {
            case panelState.basic:
                emit(evtNode.basicPanel, evtFunc.doubleBetting);
                break;

            case panelState.fourSum:
                emit(evtNode.fourSumPanel, evtFunc.doubleBetting);
                break;
        }
    }

    private clickReBetBtn(event, customEventData) {
        if (!gameConfig.isBettable) return;

        switch (gameConfig.panel) {
            case panelState.basic:
                emit(evtNode.basicPanel, evtFunc.loadBettingHistory);
                break;

            case panelState.fourSum:
                emit(evtNode.fourSumPanel, evtFunc.loadBettingHistory);
                break;

            case panelState.jackpot:
                emit(evtNode.jackpotPanel, evtFunc.loadBettingHistory);
                break;
        }
    }

    private clickUndoBtn(event, customEventData) {
        if (!gameConfig.isBettable) return;

        switch (gameConfig.panel) {
            case panelState.basic:
                emit(evtNode.basicPanel, evtFunc.undoBetting);
                break;

            case panelState.fourSum:
                emit(evtNode.fourSumPanel, evtFunc.undoBetting);
                break;

            case panelState.jackpot:
                emit(evtNode.jackpotPanel, evtFunc.undoBetting);
                break;
        }
    }

    public winStart() {
        this.toggleArr.forEach(t => {
            t.interactable = false;
        });

        this.currentIndex = 0;
        this.toggleArr[this.currentIndex].isChecked = true;

        this.schedule(this.switchNextToggle, GameConstants.PANEL_CYCLE_INTERVAL, macro.REPEAT_FOREVER);
    }

    private switchNextToggle() {
        this.currentIndex = (this.currentIndex + 1) % this.toggleArr.length;
        this.toggleArr[this.currentIndex].isChecked = true;
    }

    public winEnd() {
        this.unschedule(this.switchNextToggle);

        this.toggleArr.forEach(t => {
            t.interactable = true;
        });
    }
}

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonBtns, args);
}





