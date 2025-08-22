import { _decorator, Button, Component, Node } from 'cc';
import { creatEventHandler } from '../../../Utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('ExitPopup')
export class ExitPopup extends Component {
    private shadowNode: Node = null;
    private okBtn: Button = null;
    private cancelBtn: Button = null;

    protected onLoad(): void {
        this.shadowNode = this.node.parent.getChildByName('ShadowSpr');
        this.okBtn = this.node.getChildByName('OkBtn').getComponent(Button);
        this.cancelBtn = this.node.getChildByName('CancelBtn').getComponent(Button);

        ///////////////////////////////////////////////////////////////////////////

        this.okBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickOkBtn'));
        this.cancelBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickCancelBtn'));
    }

    private clickOkBtn() {
        self.close();
    }

    private clickCancelBtn() {
        this.shadowNode.active = false;
        this.node.active = false;
    }


}


