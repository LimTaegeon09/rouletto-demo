import { _decorator, Component } from 'cc';
import { AudioStreamManager } from '../../../Network/AudioStreamManager';
const { ccclass, property } = _decorator;

@ccclass('StreamingPopup')
export class StreamingPopup extends Component {
    start() {
        this.setPopupActive(false);
    }

    public setPopupActive(active: boolean) {

        if (active) {
            AudioStreamManager.instance.startStreaming();
        }
        else {
            AudioStreamManager.instance.stopStreaming();
        }

        this.node.setPosition(0, 0);
        this.node.active = active;
    }


}


