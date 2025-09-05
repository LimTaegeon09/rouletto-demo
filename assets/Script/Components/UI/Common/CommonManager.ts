import { _decorator, Component, Label, Sprite } from 'cc';
import { gameConfig, moneyConfig } from '../../../Configs/Config';
import { GameConstants } from '../../../Configs/GameConstants';
import { formatCurrency, formatNumber } from '../../../Utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('CommonManager')
export class CommonManager extends Component {
    private bgSpr: Sprite = null;

    private basicBetLabel: Label = null;
    private fourSumBetLabel: Label = null;
    private jackpotBetLabel: Label = null;
    public jackpotWinLabel: Label = null;

    private creditLabel: Label = null;
    private winLabel: Label = null;
    private betLabel: Label = null;

    protected onLoad(): void {
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
        this.setBasicBetLabel();
    }

    private initFourSumBet() {
        moneyConfig.fourSumBet = 0;
        this.setFourSumBetLabel();
    }

    private initJackpotBet() {
        moneyConfig.jackpotBet = 0;
        this.setJackpotBetLabel();
    }

    public initJackpotWin() {
        moneyConfig.jackpotWin = GameConstants.MIN_PRIZE_JACKPOT;
        this.setJackpotWinLabel();
    }

    private initCredit() {
        this.setCreditLabel();
    }

    public initWin() {
        moneyConfig.win = 0;
        this.setWinLabel();
    }

    public initBet() {
        moneyConfig.bet = 0;
        this.setBetLabel();
    }

    /////////////////////////////////////////

    public addBasicBet(bet: number) {
        moneyConfig.basicBet += bet;
        this.setBasicBetLabel();

        this.addBet(bet);
        this.subCredit(bet);
    }

    public addFourSumBet(bet: number) {
        moneyConfig.fourSumBet += bet;
        this.setFourSumBetLabel();

        this.addBet(bet);
        this.subCredit(bet);
    }

    public addJackpotBet() {
        moneyConfig.jackpotBet += GameConstants.MIN_BET_JACKPOT;
        this.setJackpotBetLabel();

        this.addBet(GameConstants.MIN_BET_JACKPOT);
        this.subCredit(GameConstants.MIN_BET_JACKPOT);
    }

    public addJackpotWin(bet: number) {
        moneyConfig.jackpotWin += bet;
        this.setJackpotWinLabel();
    }

    private addCredit(bet: number) {
        moneyConfig.credit += bet;
        this.setCreditLabel();
    }

    public addWin(bet: number) {
        moneyConfig.win += bet;
        this.setWinLabel();
    }

    private addBet(bet: number) {
        moneyConfig.bet += bet;
        this.setBetLabel();
    }

    /////////////////////////////////////////

    public subBasicBet(bet: number) {
        moneyConfig.basicBet -= bet;
        this.setBasicBetLabel();

        this.subBet(bet);
        this.addCredit(bet);
    }

    public subFourSumBet(bet: number) {
        moneyConfig.fourSumBet -= bet;
        this.setFourSumBetLabel();

        this.subBet(bet);
        this.addCredit(bet);
    }

    public subJackpotBet() {
        moneyConfig.jackpotBet -= GameConstants.MIN_BET_JACKPOT;
        this.setJackpotBetLabel();

        this.subBet(GameConstants.MIN_BET_JACKPOT);
        this.addCredit(GameConstants.MIN_BET_JACKPOT);
    }

    private subCredit(bet: number) {
        moneyConfig.credit -= bet;
        this.setCreditLabel();
    }

    private subBet(bet: number) {
        moneyConfig.bet -= bet;
        this.setBetLabel();
    }

    /////////////////////////////////////////

    private setBasicBetLabel() {
        this.basicBetLabel.string = gameConfig.currency.symbol + formatNumber(moneyConfig.basicBet);
    }

    private setFourSumBetLabel() {
        this.fourSumBetLabel.string = gameConfig.currency.symbol + formatNumber(moneyConfig.fourSumBet);
    }

    private setJackpotBetLabel() {
        this.jackpotBetLabel.string = gameConfig.currency.symbol + formatNumber(moneyConfig.jackpotBet);
    }

    private setJackpotWinLabel() {
        this.jackpotWinLabel.string = gameConfig.currency.code + '\n' + formatCurrency(moneyConfig.jackpotWin, 2);
    }

    private setCreditLabel() {
        this.creditLabel.string = gameConfig.currency.symbol + ' ' + formatCurrency(moneyConfig.credit, 2);
    }

    private setWinLabel() {
        this.winLabel.string = gameConfig.currency.symbol + ' ' + formatCurrency(moneyConfig.win, 2);
    }

    private setBetLabel() {
        this.betLabel.string = gameConfig.currency.symbol + ' ' + formatCurrency(moneyConfig.bet, 2);
    }

    /////////////////////////////////////////

    public gameEnd() {
        this.initBasicBet();
        this.initFourSumBet();
        this.initJackpotBet();

        this.addCredit(moneyConfig.win);
        moneyConfig.win = 0;
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







