import { _decorator, Animation, Component, Label, Node, Size, Sprite, Tween, tween, v3, Vec3, view } from 'cc';
import { formatCurrency } from '../../../Utils/Utils';
import { evtNode } from '../../EventManager';
const { ccclass, property } = _decorator;

@ccclass('PresentationManager')
export class PresentationManager extends Component {
    private callsBgNode: Node = null;
    private callsTextNode: Node = null;
    private tweensArr: Tween<Node>[] = [];

    ///////////////////////////////////////

    private totalWinSpr: Sprite = null;
    private totalWinLabel: Label = null;
    private repeatCount: number = 0;

    private designSize: Size = null;
    private maxBetNode: Node = null;
    private maxBetTween: Tween<Node> = null;
    private notCreditNode: Node = null;
    private notCreditTween: Tween<Node> = null;

    protected onLoad(): void {
        const callsText = this.node.getChildByName('CallsText');
        this.callsBgNode = callsText.getChildByName('BgSpr');
        this.callsTextNode = callsText.getChildByName('TextSpr');

        /////////////////////////////////////////////////////////////////////////////////////

        const totalWin = this.node.getChildByName('TotalWin');
        this.totalWinSpr = totalWin.getChildByName('winSpr').getComponent(Sprite);
        this.totalWinLabel = totalWin.getChildByName('winLabel').getComponent(Label);

        const moneyIssue = this.node.getChildByName('MoneyIssue');
        this.maxBetNode = moneyIssue.getChildByName('MaxBetSpr');
        this.notCreditNode = moneyIssue.getChildByName('NotCreditSpr');
    }

    protected start(): void {
        this.designSize = view.getDesignResolutionSize();

        this.totalWinSpr.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            if (this.repeatCount < 5) {
                this.totalWinSpr.getComponent(Animation).play('winAnim');
                this.repeatCount++;
            }
        }, this);
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
            0.5,
            0.9,
            0.5
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
            0.3,
            0.5,
            0.3
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
            0.5,
            0.9,
            0.5
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
            0.3,
            0.5,
            0.3
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

        this.callsBgNode.setPosition(0, -379);
        this.callsBgNode.active = true;

        //////////////////////////////////////////////////

        const spr = this.callsTextNode.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame('Messge_NGS');

        const posArr = [
            v3(157, -413),
            v3(165, -413),
        ];
        const time = 0.5;
        const action = tween()
            .delay(time)
            .set({ position: posArr[1] })
            .delay(time)
            .set({ position: posArr[0] });

        this.callsTextNode.setPosition(posArr[0]);
        this.callsTextNode.active = true;

        this.tweensArr[0] = tween(this.callsTextNode)
            .repeatForever(action)
            .start();
    }

    public endNGS() {
        this.tweensArr.forEach(t => {
            if (t) t.stop();
        });

        this.callsBgNode.active = false;
        this.callsTextNode.active = false;
    }

    //////////////////////////

    public startTotalWin(totalWin: number) {
        this.totalWinSpr.node.active = true;
        this.playAnimationRepeatedly();

        this.totalWinLabel.node.active = true;
        this.totalWinLabel.string = '$ ' + formatCurrency(totalWin, 1);
    }

    private playAnimationRepeatedly() {
        this.repeatCount = 0;
        this.totalWinSpr.getComponent(Animation).play('winAnim');
        this.repeatCount++;
    }

    public endTotalWin() {
        this.totalWinSpr.node.active = false;
        this.totalWinLabel.node.active = false;
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



}


