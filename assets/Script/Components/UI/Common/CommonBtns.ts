import { _decorator, Button, Component, Label, macro, Node, Sprite, Toggle } from 'cc';
import { gameConfig, panelState, volumeState } from '../../../Configs/Config';
import { GameConstants } from '../../../Configs/GameConstants';
import { sndType, SoundManager } from '../../../managers/SoundManager';
import { creatEventHandler, formatNumber, pickRandomNumbers } from '../../../Utils/Utils';
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
    private helpToggle: Toggle = null;
    private exitBtn: Button = null;

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
        this.helpToggle = rightBtns.getChildByName('HelpToggle').getComponent(Toggle);
        this.exitBtn = rightBtns.getChildByName('ExitBtn').getComponent(Button);

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
        this.helpToggle.checkEvents.push(creatEventHandler(this.node, this, 'toggleHelp'));
        this.exitBtn.getComponent(Button).clickEvents.push(creatEventHandler(this.node, this, 'clickExit'));

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

        this.setVolume(gameConfig.volume);

        this.fourSumToggle.isChecked = false;
        this.jackpotToggle.isChecked = false;
    }

    private togglePanel(event, customEventData) {
        const isChecked = event.target.getComponent(Toggle).isChecked;
        if (isChecked) {
            if (gameConfig.panel == customEventData) return;
        }

        let spriteFrameName;

        switch (customEventData) {
            case panelState.basic:
                emitCommonBtns(evtNode.basicPanel, evtFunc.setPanelActive, isChecked);
                spriteFrameName = 'BG_Basic';
                break;
            case panelState.fourSum:
                emitCommonBtns(evtNode.fourSumPanel, evtFunc.setPanelActive, isChecked);
                spriteFrameName = 'BG_FourSum';
                break;
            case panelState.jackpot:
                emitCommonBtns(evtNode.jackpotPanel, evtFunc.setPanelActive, isChecked);
                spriteFrameName = 'BG_Jackpot';
                break;
        }
        if (isChecked) {
            gameConfig.panel = customEventData;
            this.commonManager.setBgSpr(spriteFrameName);
            this.setStreamingToggle(false);

            SoundManager.instance.play(sndType.betting_layout_change);
        }
    }

    private toggleStreaming(event, customEventData) {
        const isChecked = event.target.getComponent(Toggle).isChecked;
        emitCommonBtns(evtNode.popupManager, evtFunc.toggleStreamingPopup, isChecked);

        SoundManager.instance.play(sndType.live_cam_button);
    }

    public setStreamingToggle(is: boolean) {
        if (this.liveToggle.isChecked === is) return;
        this.liveToggle.isChecked = is;
    }

    private toggleHelp(event, customEventData) {
        const isChecked = event.target.getComponent(Toggle).isChecked;
        emitCommonBtns(evtNode.popupManager, evtFunc.toggleHelpPopup, isChecked);

        SoundManager.instance.play(sndType.help_button);
    }

    public setHelpToggle(is: boolean) {
        if (this.helpToggle.isChecked === is) return;
        this.helpToggle.isChecked = is;
    }

    private clickVolume() {
        this.setVolume();
    }

    private clickExit() {
        emitCommonBtns(evtNode.popupManager, evtFunc.openExitPopup);

        SoundManager.instance.play(sndType.exit_button);
    }

    public setVolume(customEventData?: number) {
        if (customEventData != null) gameConfig.volume = customEventData;
        else gameConfig.volume++;

        if (gameConfig.volume > volumeState.high) gameConfig.volume = volumeState.off;

        let spriteFrameName = 'btn_sound_off';
        SoundManager.instance.volume = 0;

        switch (gameConfig.volume) {
            case volumeState.low:
                spriteFrameName = 'btn_sound_on1';
                SoundManager.instance.volume = 1 / 3;
                break;
            case volumeState.mid:
                spriteFrameName = 'btn_sound_on2';
                SoundManager.instance.volume = 2 / 3;
                break;
            case volumeState.high:
                spriteFrameName = 'btn_sound_on3';
                SoundManager.instance.volume = 1;
                break;
        }
        const sndSpr = this.sndBtnNode.getComponent(Sprite);
        sndSpr.spriteFrame = sndSpr.spriteAtlas.getSpriteFrame(spriteFrameName);

        SoundManager.instance.setVolume();
        SoundManager.instance.play(sndType.voulme_button);
    }

    private toggleAuto(event, customEventData) {
        const isChecked = !event.target.getComponent(Toggle).isChecked;

        let spriteFrameName = 'btn_Auto_rebet_off';
        if (isChecked) spriteFrameName = 'btn_Auto_rebet_on';

        const autoSpr = this.autoToggleNode.getComponent(Sprite);
        autoSpr.spriteFrame = autoSpr.spriteAtlas.getSpriteFrame(spriteFrameName);

        gameConfig.isAutoReBet = isChecked;

        const snd = isChecked ? sndType.autorebet_off_button : sndType.autorebet_on_button;
        SoundManager.instance.play(snd);


        //!----- for Test -----!//
        
        if (isChecked) {
            const ran = pickRandomNumbers();
            emitUIManager(evtFunc.ballResults, [3, 12, 9, 6]);
        }
        else {
            emitUIManager(evtFunc.gameEnd);
        }
        
        //!--------------------!//
    }

    private clickDenom(event, customEventData) {
        let denom = 0;
        switch (parseInt(customEventData)) {
            case 0:
                denom = 1;
                break;
            case 1:
                denom = 2;
                break;
            case 2:
                denom = 5;
                break;
            case 3:
                denom = 10;
                break;
        }

        const _denom = gameConfig.denom;
        gameConfig.denom = denom;
        gameConfig.currentBet = gameConfig.chip * gameConfig.denom;

        if (_denom !== gameConfig.denom) SoundManager.instance.play(sndType.change_denom_button);
    }

    private clickChip(event, customEventData) {
        const index = parseInt(customEventData);

        this.chipOverSprNode.setPosition(this.chipBtnNodes[index].getPosition());
        this.chipOverSprNode.active = true;

        const _chip = gameConfig.chip;
        gameConfig.chip = GameConstants.CHIP_VALUES[index];
        gameConfig.currentBet = gameConfig.chip * gameConfig.denom;

        if (_chip !== gameConfig.chip) SoundManager.instance.play(sndType.chip_select);
    }

    private clickClearBtn(event, customEventData) {
        switch (gameConfig.panel) {
            case panelState.basic:
                emitUIManager(evtFunc.clearBasic);
                break;

            case panelState.fourSum:
                emitUIManager(evtFunc.clearFourSum);
                break;

            case panelState.jackpot:
                emitUIManager(evtFunc.clearJackpot);
                break;
        }

        SoundManager.instance.play(sndType.clear_all_button);
    }

    private clickDoubleBtn(event, customEventData) {
        switch (gameConfig.panel) {
            case panelState.basic:
                emitCommonBtns(evtNode.basicPanel, evtFunc.doubleBetting);
                break;

            case panelState.fourSum:
                emitCommonBtns(evtNode.fourSumPanel, evtFunc.doubleBetting);
                break;
        }

        SoundManager.instance.play(sndType.double_bet_button);
    }

    private clickReBetBtn(event, customEventData) {
        switch (gameConfig.panel) {
            case panelState.basic:
                emitCommonBtns(evtNode.basicPanel, evtFunc.loadBettingHistory);
                break;

            case panelState.fourSum:
                emitCommonBtns(evtNode.fourSumPanel, evtFunc.loadBettingHistory);
                break;

            case panelState.jackpot:
                emitCommonBtns(evtNode.jackpotPanel, evtFunc.loadBettingHistory);
                break;
        }

        SoundManager.instance.play(sndType.rebet_button);
    }

    private clickUndoBtn(event, customEventData) {
        switch (gameConfig.panel) {
            case panelState.basic:
                emitCommonBtns(evtNode.basicPanel, evtFunc.undoBetting);
                break;

            case panelState.fourSum:
                emitCommonBtns(evtNode.fourSumPanel, evtFunc.undoBetting);
                break;

            case panelState.jackpot:
                emitCommonBtns(evtNode.jackpotPanel, evtFunc.undoBetting);
                break;
        }

        SoundManager.instance.play(sndType.undo_button);
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

    public bettingBtnsLock() {
        this.clearBtn.interactable = false;
        this.doubleBtn.interactable = false;
        this.reBetBtn.interactable = false;
        this.undoBtn.interactable = false;
    }

    public bettingBtnsUnlock() {
        this.clearBtn.interactable = true;
        this.doubleBtn.interactable = true;
        this.reBetBtn.interactable = true;
        this.undoBtn.interactable = true;
    }

    private hideChipBtns() {
        this.chipBtnNodes.forEach(c => {
            c.active = false;
        });

        this.chipOverSprNode.active = false;
    }

    private showChipBtns() {
        this.chipBtnNodes.forEach(c => {
            c.active = true;
        });

        this.chipOverSprNode.active = true;
    }
}

function emitCommonBtns(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonBtns, args);
}

function emitUIManager(...args: any[]) {
    EventManager.instance.node.emit(evtNode.uiManager, args);
}






