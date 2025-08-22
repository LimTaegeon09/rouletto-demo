import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StreamingPopup')
export class StreamingPopup extends Component {
    start() {
        this.setPopupActive(false);
    }

    public setPopupActive(active: boolean) {
        this.node.setPosition(0, 0);
        this.node.active = active;
    }


}


