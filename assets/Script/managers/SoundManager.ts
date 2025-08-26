import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum sndType {
    autorebet_off_button = 'autorebet_off_button',
    autorebet_on_button = 'autorebet_on_button',
    betting_chip = 'betting_chip',
    betting_layout_change = 'betting_layout_change',
    change_denom_button = 'change_denom_button',
    chip_select = 'chip_select',
    clear_all_button = 'clear_all_button',
    double_bet_button = 'double_bet_button',
    exit_button = 'exit_button',
    help_button = 'help_button',
    jackpot_game__cancel_button = 'jackpot_game__cancel_button',
    jackpot_game_bet_button = 'jackpot_game_bet_button',
    jackpot_game_random_button = 'jackpot_game_random_button',
    live_cam_button = 'live_cam_button',
    maxbet_notenoughtmoney_message = 'maxbet_notenoughtmoney_message',
    nomorebets = 'nomorebets',
    placeyourbetsplease = 'placeyourbetsplease',
    rebet_button = 'rebet_button',
    undo_button = 'undo_button',
    voulme_button = 'voulme_button',
    youwin = 'youwin'
}

@ccclass('SoundManager')
export class SoundManager extends Component {
    private static _instance: SoundManager = null;

    public soundMap: Map<string, AudioClip> = new Map();
    private effectSources: AudioSource[] = [];

    public volume: number = 0;

    public static get instance(): SoundManager {
        if (this._instance === null) {
            let soundManagerNode = new Node('SoundManager');
            let soundManager = soundManagerNode.addComponent(SoundManager);
            director.addPersistRootNode(soundManagerNode);

            this._instance = soundManager;
        }

        return this._instance;
    }

    protected onLoad(): void {
        for (let i = 0; i < Object.keys(sndType).length; ++i) {
            let audioSource = this.addComponent(AudioSource);
            audioSource.loop = false;
            audioSource.playOnAwake = false;
            this.effectSources.push(audioSource);
        }
    }

    public play(soundType: sndType) {
        const clip = this.soundMap.get(soundType);
        if (!clip) return;

        let sourceToReplay = this.effectSources.find(source => source.playing && source.clip.name === clip.name);

        if (sourceToReplay) {
            sourceToReplay.stop();
            sourceToReplay.play();
        }
        else {
            this.playEffect(soundType);
        }
    }

    public setVolume() {
        for (const source of this.effectSources) {
            if (source.playing) {
                source.volume = this.volume;
            }
        }
    }

    private playEffect(soundType: sndType) {
        const clip = this.soundMap.get(soundType);
        if (!clip) return;

        let sourceToPlay = this.effectSources.find(source => !source.playing);

        if (sourceToPlay) {
            sourceToPlay.clip = clip;
            sourceToPlay.volume = this.volume;
            sourceToPlay.play();
        }
    }
}



