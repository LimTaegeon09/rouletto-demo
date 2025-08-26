import { _decorator, Component, find, Node } from 'cc';
import { CommonBtns } from '../Common/CommonBtns';
import { ExitPopup } from './ExitPopup';
import { StreamingPopup } from './StreamingPopup';
const { ccclass, property } = _decorator;

@ccclass('PopupManager')
export class PopupManager extends Component {
    private commonBtns: CommonBtns = null;

    private shadowNode: Node = null;
    private exitPopup: ExitPopup = null;
    public errorPopupNode: Node = null;
    private helpPopupNode: Node = null;

    private streamingPopup: StreamingPopup = null;

    protected onLoad(): void {
        this.commonBtns = find('Canvas/UI').getChildByName('Common').getComponent(CommonBtns);

        this.shadowNode = this.node.getChildByName('ShadowSpr');
        this.exitPopup = this.node.getChildByName('ExitPopup').getComponent(ExitPopup);
        this.errorPopupNode = this.node.getChildByName('ErrorPopup');
        this.helpPopupNode = this.node.getChildByName('HelpPopup');

        this.streamingPopup = this.node.getChildByName('StreamingPopup').getComponent(StreamingPopup);
    }

    protected start(): void {

    }

    public openExitPopup() {
        this.commonBtns.setStreamingToggle(false);
        this.commonBtns.setHelpToggle(false);

        this.shadowNode.active = true;
        this.exitPopup.node.active = true;
    }

    //////////////////////////////////////////

    public openErrorPopup() {
        this.commonBtns.setStreamingToggle(false);
        this.commonBtns.setHelpToggle(false);
        this.exitPopup.node.active = false;

        this.shadowNode.active = true;
        this.errorPopupNode.active = true;
    }

    public closeErrorPopup() {
        if (this.errorPopupNode.active) {
            this.shadowNode.active = false;
            this.errorPopupNode.active = false;
        }
    }

    //////////////////////////////////////////

    public toggleHelpPopup(is: boolean) {
        if (is) {
            this.commonBtns.setStreamingToggle(false);
        }

        this.helpPopupNode.active = is;
    }

    //////////////////////////////////////////

    public toggleStreamingPopup(is: boolean) {
        if (is) {
            this.commonBtns.setHelpToggle(false);
        }

        this.streamingPopup.setPopupActive(is);
    }
}


