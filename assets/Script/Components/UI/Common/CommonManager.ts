import { _decorator, Component, find, Label, Sprite } from 'cc';
import { moneyConfig } from '../../../Configs/Config';
import { GameConstants } from '../../../Configs/GameConstants';
import { formatCurrency, formatNumber } from '../../../Utils/Utils';
import { UIManager } from '../UIManager';
const { ccclass, property } = _decorator;

@ccclass('CommonManager')
export class CommonManager extends Component {
    private uiManager: UIManager = null;

    private bgSpr: Sprite = null;

    private basicBetLabel: Label = null;
    private fourSumBetLabel: Label = null;
    private jackpotBetLabel: Label = null;
    private jackpotWinLabel: Label = null;

    private creditLabel: Label = null;
    private winLabel: Label = null;
    private betLabel: Label = null;

    protected onLoad(): void {
        this.uiManager = find('Canvas/UI').getComponent(UIManager);

        this.bgSpr = this.node.getChildByName('BgSpr').getComponent(Sprite);

        const top = this.node.getChildByName('Top');
        const bottom = this.node.getChildByName('Bottom');

        const leftBtns = top.getChildByName('LeftBtns');
        const basicToggle = leftBtns.getChildByName('BasicToggle');
        const fourSumToggle = leftBtns.getChildByName('SumToggle');
        const jackpotToggle = leftBtns.getChildByName('JackpotToggle');

        this.basicBetLabel = basicToggle.getChildByName('BetLabel').getComponent(Label);
        this.fourSumBetLabel = fourSumToggle.getChildByName('BetLabel').getComponent(Label);
        this.jackpotBetLabel = jackpotToggle.getChildByName('BetLabel').getComponent(Label);
        this.jackpotWinLabel = jackpotToggle.getChildByName('JackpotLabel').getComponent(Label);

        const amount = bottom.getChildByName('Amount');
        const credit = amount.getChildByName('Credit');
        const win = amount.getChildByName('Win');
        const bet = amount.getChildByName('Bet');

        this.creditLabel = credit.getChildByName('CreditLabel').getComponent(Label);
        this.winLabel = win.getChildByName('WinLabel').getComponent(Label);
        this.betLabel = bet.getChildByName('BetLabel').getComponent(Label);
    }

    start() {
        this.initAmount();
    }

    public setBgSpr(spriteFrameName: string) {
        this.bgSpr.spriteFrame = this.bgSpr.spriteAtlas.getSpriteFrame(spriteFrameName);
    }

    private initAmount() {
        this.initBasicBet();
        this.initFourSumBet();
        this.initJackpotBet();
        this.initJackpotWin();
        this.initCredit();
        this.initWin();
        this.initBet();
    }

    /////////////////////////////////////////

    private initBasicBet() {
        moneyConfig.basicBet = 0;
        this.basicBetLabel.string = '$' + formatNumber(moneyConfig.basicBet);
    }

    private initFourSumBet() {
        moneyConfig.fourSumBet = 0;
        this.fourSumBetLabel.string = '$' + formatNumber(moneyConfig.fourSumBet);
    }

    private initJackpotBet() {
        moneyConfig.jackpotBet = 0;
        this.jackpotBetLabel.string = '$' + formatNumber(moneyConfig.jackpotBet);
    }

    public initJackpotWin() {
        moneyConfig.jackpotWin = GameConstants.MIN_PRIZE_JACKPOT;
        this.jackpotWinLabel.string = 'USD\n' + formatCurrency(moneyConfig.jackpotWin, 1);
    }

    private initCredit() {
        this.creditLabel.string = 'USD ' + formatCurrency(moneyConfig.credit, 1);
    }

    public initWin() {
        moneyConfig.win = 0;
        this.winLabel.string = '$ ' + formatCurrency(moneyConfig.win, 1);
    }

    public initBet() {
        moneyConfig.bet = 0;
        this.betLabel.string = '$ ' + formatNumber(moneyConfig.bet);
    }

    /////////////////////////////////////////

    public addBasicBet(bet: number) {
        moneyConfig.basicBet += bet;
        this.basicBetLabel.string = '$' + formatNumber(moneyConfig.basicBet);

        this.addBet(bet);
        this.subCredit(bet);
    }

    public addFourSumBet(bet: number) {
        moneyConfig.fourSumBet += bet;
        this.fourSumBetLabel.string = '$' + formatNumber(moneyConfig.fourSumBet);

        this.addBet(bet);
        this.subCredit(bet);
    }

    public addJackpotBet() {
        moneyConfig.jackpotBet += GameConstants.MIN_BET_JACKPOT;
        this.jackpotBetLabel.string = '$' + formatNumber(moneyConfig.jackpotBet);

        this.addBet(GameConstants.MIN_BET_JACKPOT);
        this.subCredit(GameConstants.MIN_BET_JACKPOT);
    }

    public addJackpotWin() {
        moneyConfig.jackpotWin += this.uiManager.jackpotPanel.getIsBetting();
        this.jackpotWinLabel.string = 'USD\n' + formatCurrency(moneyConfig.jackpotWin, 1);
    }

    private addCredit(bet: number) {
        moneyConfig.credit += bet;
        this.creditLabel.string = 'USD ' + formatCurrency(moneyConfig.credit, 1);
    }

    public addWin(bet: number) {
        moneyConfig.win += bet;
        this.winLabel.string = '$ ' + formatCurrency(moneyConfig.win, 1);
    }

    private addBet(bet: number) {
        moneyConfig.bet += bet;
        this.betLabel.string = '$ ' + formatNumber(moneyConfig.bet);
    }

    /////////////////////////////////////////

    public subBasicBet(bet: number) {
        moneyConfig.basicBet -= bet;
        this.basicBetLabel.string = '$' + formatNumber(moneyConfig.basicBet);

        this.subBet(bet);
        this.addCredit(bet);
    }

    public subFourSumBet(bet: number) {
        moneyConfig.fourSumBet -= bet;
        this.fourSumBetLabel.string = '$' + formatNumber(moneyConfig.fourSumBet);

        this.subBet(bet);
        this.addCredit(bet);
    }

    public subJackpotBet() {
        moneyConfig.jackpotBet -= GameConstants.MIN_BET_JACKPOT;
        this.jackpotBetLabel.string = '$' + formatNumber(moneyConfig.jackpotBet);

        this.subBet(GameConstants.MIN_BET_JACKPOT);
        this.addCredit(GameConstants.MIN_BET_JACKPOT);
    }

    private subCredit(bet: number) {
        moneyConfig.credit -= bet;
        this.creditLabel.string = 'USD ' + formatCurrency(moneyConfig.credit, 1);
    }

    private subBet(bet: number) {
        moneyConfig.bet -= bet;
        this.betLabel.string = '$ ' + formatNumber(moneyConfig.bet);
    }

    /////////////////////////////////////////

    public gameEnd() {
        this.initBasicBet();
        this.initFourSumBet();
        this.initJackpotBet();

        this.addCredit(moneyConfig.win);
    }

    public clearBasicBet() {
        this.addCredit(moneyConfig.basicBet);
        this.subBet(moneyConfig.basicBet);

        this.initBasicBet();
    }

    public clearFourSumBet() {
        this.addCredit(moneyConfig.fourSumBet);
        this.subBet(moneyConfig.fourSumBet);

        this.initFourSumBet();
    }

    public clearJackpotBet() {
        this.addCredit(moneyConfig.jackpotBet);
        this.subBet(moneyConfig.jackpotBet);

        this.initJackpotBet();
    }




}






