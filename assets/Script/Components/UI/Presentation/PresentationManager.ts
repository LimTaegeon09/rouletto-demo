import { _decorator, Color, Component, Graphics, Label, Node, Size, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3, Vec3, view } from 'cc';
import { Assets } from '../../../Configs/Assets';
import { formatCurrency } from '../../../Utils/Utils';
import { evtNode } from '../../EventManager';
const { ccclass, property } = _decorator;

@ccclass('PresentationManager')
export class PresentationManager extends Component {
    private callsBgNode: Node = null;
    private callsTextNode: Node = null;
    private tweensArr: Tween<any>[] = [];
    private ngsFrames: SpriteFrame[] = [];
    private ngsSequence: Tween<any> = null;

    ///////////////////////////////////////

    private totalWin: Node = null;
    private totalWinTween: Tween<Sprite> = null;

    ///////////////////////////////////////

    private designSize: Size = null;
    private maxBetNode: Node = null;
    private maxBetTween: Tween<Node> = null;
    private notCreditNode: Node = null;
    private notCreditTween: Tween<Node> = null;

    ///////////////////////////////////////

    private countDownNode: Node = null;
    private countDownTween: Tween<any>[] = [];

    protected onLoad(): void {
        const callsText = this.node.getChildByName('CallsText');
        this.callsBgNode = callsText.getChildByName('BgSpr');
        this.callsTextNode = callsText.getChildByName('TextSpr');

        /////////////////////////////////////////////////////////////////////////////////////

        this.totalWin = this.node.getChildByName('TotalWin');

        /////////////////////////////////////////////////////////////////////////////////////

        const moneyIssue = this.node.getChildByName('MoneyIssue');
        this.maxBetNode = moneyIssue.getChildByName('MaxBetSpr');
        this.notCreditNode = moneyIssue.getChildByName('NotCreditSpr');

        /////////////////////////////////////////////////////////////////////////////////////

        this.countDownNode = this.node.getChildByName('CountDown').getChildByName('Sprite');
    }

    protected start(): void {
        this.designSize = view.getDesignResolutionSize();

        const bgGraphics = this.totalWin.getChildByName('BgGraphics').getComponent(Graphics);
        bgGraphics.roundRect(-970 / 2, -113 / 2, 970, 113, 10);
        bgGraphics.fillColor = new Color(0, 0, 0, 255 * 0.8);
        bgGraphics.fill();

        for (let i = 0; i <= 30; i++) {
            const paddedString = String(i).padStart(4, '0');
            const sprFrame = Assets.instance.ngsAtlas0.getSpriteFrame('NGSS_' + paddedString);
            this.ngsFrames.push(sprFrame);
        }
        for (let i = 31; i <= 59; i++) {
            const paddedString = String(i).padStart(4, '0');
            const sprFrame = Assets.instance.ngsAtlas1.getSpriteFrame('NGSS_' + paddedString);
            this.ngsFrames.push(sprFrame);
        }

        this.ngsSequence = tween();
        for (const frame of this.ngsFrames) {
            this.ngsSequence.set({ spriteFrame: frame }).delay(0.07);
        }
        this.ngsSequence.delay(0.5);

        ////////////////////////////////////////////////////////////

    }

    public startNMB() {
        this.tweensArr.forEach(t => {
            if (t) t.stop();
        });

        this.callsBgNode.setPosition(-1920, -379);
        const bgPosArr = [
            v3(0, -379),
            v3(0, -379),
            v3(1920, -379),
        ];
        const bgTimeArr = [
            0.7,
            2.2,
            0.3
        ];
        this.callsBgNode.active = true;

        this.tweensArr[0] = tween(this.callsBgNode)
            .to(bgTimeArr[0], { position: bgPosArr[0] })
            .to(bgTimeArr[1], { position: bgPosArr[1] })
            .to(bgTimeArr[2], { position: bgPosArr[2] })
            .set({ active: false })
            .start();

        //////////////////////////////////////////////////

        const spr = this.callsTextNode.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame('Messge_NMB');

        this.callsTextNode.setPosition(-1211, -379);
        const posArr = [
            v3(320, -401),
            v3(389, -401),
            v3(1920, -401),
        ];
        const timeArr = [
            0.5,
            1.8,
            0.5
        ];
        this.callsTextNode.active = true;

        this.tweensArr[1] = tween(this.callsTextNode)
            .to(timeArr[0], { position: posArr[0] })
            .to(timeArr[1], { position: posArr[1] })
            .to(timeArr[2], { position: posArr[2] })
            .set({ active: false })
            .start();
    }

    public startPYB() {
        this.tweensArr.forEach(t => {
            if (t) t.stop();
        });

        this.callsBgNode.setPosition(-1920, -379);
        const bgPosArr = [
            v3(0, -379),
            v3(0, -379),
            v3(1920, -379),
        ];
        const bgTimeArr = [
            0.7,
            2.2,
            0.3
        ];
        this.callsBgNode.active = true;

        this.tweensArr[0] = tween(this.callsBgNode)
            .to(bgTimeArr[0], { position: bgPosArr[0] })
            .to(bgTimeArr[1], { position: bgPosArr[1] })
            .to(bgTimeArr[2], { position: bgPosArr[2] })
            .set({ active: false })
            .start();

        //////////////////////////////////////////////////

        const spr = this.callsTextNode.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame('Messge_PYB');

        this.callsTextNode.setPosition(-1415, -400);
        const posArr = [
            v3(216, -400),
            v3(286, -400),
            v3(1920, -400),
        ];
        const timeArr = [
            0.5,
            1.8,
            0.5
        ];
        this.callsTextNode.active = true;

        this.tweensArr[1] = tween(this.callsTextNode)
            .to(timeArr[0], { position: posArr[0] })
            .to(timeArr[1], { position: posArr[1] })
            .to(timeArr[2], { position: posArr[2] })
            .set({ active: false })
            .start();
    }

    public startNGS() {
        this.tweensArr.forEach(t => {
            if (t) t.stop();
        });

        this.callsTextNode.setPosition(0, -379);
        this.callsTextNode.active = true;

        this.tweensArr[0] = tween(this.callsTextNode.getComponent(Sprite))
            .repeatForever(this.ngsSequence)
            .start();
    }

    public endNGS() {
        this.tweensArr.forEach(t => {
            if (t) t.stop();
        });

        this.callsTextNode.active = false;
    }

    //////////////////////////

    public startTotalWin(totalWin: number) {
        this.totalWin.active = true;

        const totalWinSpr = this.totalWin.getChildByName('WinSpr').getComponent(Sprite);
        const totalWinLabel = this.totalWin.getChildByName('WinLabel').getComponent(Label);

        const sequence = tween();
        for (let i = 0; i <= 9; i++) {
            const sprFrame = totalWinSpr.spriteAtlas.getSpriteFrame('con_' + i);
            sequence.set({ spriteFrame: sprFrame }).delay(0.07);
        }
        sequence.delay(0.5);

        if (this.totalWinTween) this.totalWinTween.stop();
        this.totalWinTween = tween(totalWinSpr)
            .repeatForever(sequence)
            .start();

        totalWinLabel.string = '$ ' + formatCurrency(totalWin, 1);
    }

    public endTotalWin() {
        if (this.totalWinTween) this.totalWinTween.stop();
        this.totalWin.active = false;
    }

    //////////////////////////

    public showMaxBet(evt: string, pos: Vec3) {
        if (this.maxBetTween) this.maxBetTween.stop();

        let dis = 55;
        if (evt === evtNode.fourSumPanel) dis = 75.5;

        this.maxBetNode.active = true;
        this.maxBetNode.setPosition(pos.x, pos.y - this.designSize.height + dis);

        this.maxBetTween = tween(this.maxBetNode)
            .delay(1.0)
            .set({ active: false })
            .start();
    }

    public showNotCredit(evt: string, pos: Vec3) {
        if (this.notCreditTween) this.notCreditTween.stop();

        let dis = 52.5;
        if (evt === evtNode.fourSumPanel) dis = 73.5;
        else if (evt === evtNode.jackpotPanel) dis = 48;

        this.notCreditNode.active = true;
        this.notCreditNode.setPosition(pos.x, pos.y - this.designSize.height + dis);

        this.notCreditTween = tween(this.notCreditNode)
            .delay(1.0)
            .set({ active: false })
            .start();
    }

    public hideMoneyIssue() {
        if (this.maxBetTween) this.maxBetTween.stop();
        if (this.notCreditTween) this.notCreditTween.stop();

        this.maxBetNode.active = false;
        this.notCreditNode.active = false;
    }

    //////////////////////////

    public startCountDown() {
        this.countDownAnim(9);
    }

    public endCountDown() {
        this.countDownTween.forEach(t => {
            if (t) t.stop();
        });

        const uiOpacity = this.countDownNode.getComponent(UIOpacity);
        uiOpacity.opacity = 0;
    }

    private countDownAnim(index: number) {
        const uiOpacity = this.countDownNode.getComponent(UIOpacity);
        uiOpacity.opacity = 0;

        if (index <= 0) return;

        this.countDownTween.forEach(t => {
            if (t) t.stop();
        });

        const spr = this.countDownNode.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame('num_' + index);

        this.countDownNode.setScale(4, 4);

        /////////////////////////////////////////////////////////////

        const timeArr = [
            0.4,
            0.6,
        ];

        this.countDownTween[0] = tween(this.countDownNode)
            .to(timeArr[0], { scale: v3(1, 1) })
            .delay(timeArr[1])
            .call(() => {
                this.countDownAnim(index - 1);
            })
            .start();

        this.countDownTween[1] = tween(uiOpacity)
            .to(timeArr[0], { opacity: 255 })
            .start();
    }



}


