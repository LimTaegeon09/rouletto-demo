import { _decorator, Component } from 'cc';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
import { JackpotPage } from './JackpotPage';
const { ccclass, property } = _decorator;

interface PageInfo {
    pageIndex: number;
    betNumbers: number[];
}

@ccclass('JackpotPanel')
export class JackpotPanel extends Component {
    public jackpotPages: JackpotPage[] = [];

    private currentPageRecord: PageInfo[] = [];
    private previousPageRecord: PageInfo[] = [];

    protected onLoad(): void {
        for (let i = 0; i < 5; i++) {
            const page = this.node.getChildByName('PageSpr' + i);
            page.addComponent(JackpotPage);
            page.getComponent(JackpotPage).index = i;
            this.jackpotPages.push(page.getComponent(JackpotPage));
        }

        EventManager.instance.node.on(evtNode.jackpotPanel, this.evtJackpotPanel, this);
    }

    protected start(): void {
        this.setPanelActive(false);
    }

    private evtJackpotPanel(args: any[]) {
        switch (args[0]) {
            case evtFunc.addPageRecord:
                this.addPageRecord(args[1], args[2]);
                break;

            case evtFunc.removePageRecord:
                this.removePageRecord(args[1]);
                break;
        }
    }

    public setPanelActive(active: boolean) {
        this.node.setPosition(0, 0);
        this.node.active = active;
    }

    public winStart(numbers: number[]) {
        this.jackpotPages.forEach(j => {
            j.winStart(numbers);
        });
    }

    public clearPanel(is:boolean) {
        this.jackpotPages.forEach(j => {
            j.clearPage(is);
        });

        this.currentPageRecord = [];
    }

    public getIsBetting() {
        return this.currentPageRecord.length * GameConstants.INCREMENT_PRIZE_JACKPOT;
    }

    public undoBetting() {
        if (this.currentPageRecord.length === 0) return;

        this.jackpotPages[this.currentPageRecord.pop().pageIndex].clearPage(true);        

        emit(evtFunc.subJackpotBet);
    }

    public addPageRecord(index: number, numbers: number[]) {
        this.currentPageRecord.push({
            pageIndex: index,
            betNumbers: numbers
        });
    }

    public removePageRecord(index: number): void {
        if (this.currentPageRecord.length === 0) return;

        this.currentPageRecord = this.currentPageRecord.filter(page => page.pageIndex !== index);
    }

    public saveBettingHistory() {
        this.previousPageRecord = Array.from(this.currentPageRecord);
    }

    public loadBettingHistory() {
        if (this.previousPageRecord.length === 0 ||
            this.currentPageRecord.length !== 0) return;

        this.previousPageRecord.forEach(p => {
            this.jackpotPages[p.pageIndex].loadBettingHistory(p.betNumbers);
        });
    }

    public bettingBtnsLock() {
        this.jackpotPages.forEach(j => {
            j.bettingBtnsLock();
        });        
    }

    public bettingBtnsUnlock() {
        this.jackpotPages.forEach(j => {
            j.bettingBtnsUnlock();
        });
    }
}

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonManager, args);
}


