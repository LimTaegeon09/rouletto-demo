import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { AudioStreamManager } from '../Network/AudioStreamManager';
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
    youwin = 'youwin',
    ten_seconds_remaining = '10_seconds_remaining',
    casino_ambiance = 'casino-ambiance', // BGM
}

@ccclass('SoundManager')
export class SoundManager extends Component {
    private static _instance: SoundManager = null;

    public soundMap: Map<string, AudioClip> = new Map();
    private effectSources: AudioSource[] = [];
    private bgmSource: AudioSource = null;

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
        for (let i = 0; i < Object.keys(sndType).length - 1; ++i) {
            let effectAudioSource = this.addComponent(AudioSource);
            effectAudioSource.volume = this.volume;
            effectAudioSource.loop = false;
            effectAudioSource.playOnAwake = false;
            this.effectSources.push(effectAudioSource);
        }

        this.bgmSource = this.addComponent(AudioSource);
        this.bgmSource.volume = this.volume;
        this.bgmSource.loop = true;
        this.bgmSource.playOnAwake = true;
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

    public playBGM() {
        const clip = this.soundMap.get(sndType.casino_ambiance);
        if (!clip) return;

        this.bgmSource.clip = clip;
        this.bgmSource.volume = this.volume;
        this.bgmSource.play();
    }

    public setVolume() {
        for (const source of this.effectSources) {
            if (source.playing) {
                source.volume = this.volume;
            }
        }

        this.bgmSource.volume = this.volume;

        AudioStreamManager.instance.setVolume(this.volume);
    }


}



