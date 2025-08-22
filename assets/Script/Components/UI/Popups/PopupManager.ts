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
    private streamingPopup: StreamingPopup = null;

    protected onLoad(): void {
        this.commonBtns = find('Canvas/UI').getChildByName('Common').getComponent(CommonBtns);

        this.shadowNode = this.node.getChildByName('ShadowSpr');
        this.exitPopup = this.node.getChildByName('ExitPopup').getComponent(ExitPopup);
        this.streamingPopup = this.node.getChildByName('StreamingPopup').getComponent(StreamingPopup);
    }

    protected start(): void {
        //this.openExitPopup();
    }

    public openExitPopup() {
        this.commonBtns.liveToggle.isChecked = false;

        this.shadowNode.active = true;
        this.exitPopup.node.active = true;
    }

    private closeOtherPopup() {
        this.shadowNode.active = false;
        this.exitPopup.node.active = false;
    }

    public toggleStreamingPopup(is: boolean) {
        if (is) this.closeOtherPopup();

        this.streamingPopup.setPopupActive(is);
    }



}


