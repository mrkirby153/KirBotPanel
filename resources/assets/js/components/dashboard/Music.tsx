import React, {Component, FunctionComponent} from 'react';
import Switch from "../Switch";
import SettingsRepository from "../../settings_repository";
import ChannelWhitelist from "./music/ChannelWhitelist";
import QueueSettings from "./music/QueueSettings";
import SkipSettings from "./music/SkipSettings";


interface MusicWrapperProps {
    visible: boolean
}

const MusicWrapper: FunctionComponent<MusicWrapperProps> = props => {
    if (props.visible) {
        return (
            <div>
                {props.children}
            </div>
        );
    } else {
        return null;
    }
};

interface MusicState {
    enabled: boolean
}
export default class Music extends Component<{}, MusicState> {
    constructor(props) {
        super(props);

        this.state = {
            enabled: SettingsRepository.getSetting('music_enabled', 0) == 1
        };

        this.changeMaster = this.changeMaster.bind(this);
    }

    changeMaster(e) {
        let {checked} = e.target;
        this.setState({
            enabled: checked
        })
        SettingsRepository.setSetting('music_enabled', checked, true)
    }

    render() {
        return (
            <div>
                <h2>Master Switch</h2>
                <p>This switch allows KirBot to play music in voice channels on your server. If this is disabled, the
                    bot will ignore music related commands and they will not show up in help</p>
                <Switch label="Master Switch" id="music-master-switch" checked={this.state.enabled} onChange={this.changeMaster}/>
                <MusicWrapper visible={this.state.enabled}>
                    <hr/>
                    <div className="row">
                        <div className="col-12">
                            <ChannelWhitelist/>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-12">
                            <QueueSettings/>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-12">
                            <SkipSettings/>
                        </div>
                    </div>
                </MusicWrapper>
            </div>
        )
    }
}