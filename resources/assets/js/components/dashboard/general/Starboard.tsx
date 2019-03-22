import React, {Component, ReactElement} from 'react';
import Switch from "../../Switch";
import Field from "../../Field";
import SettingsRepository from "../../../settings_repository";
import _ from 'lodash';


interface StarboardState {
    channel_id: string,
    enabled: boolean,
    gild_count: number,
    self_star: boolean,
    star_count: number
}

class Starboard extends Component<{}, StarboardState> {
    constructor(props) {
        super(props);
        this.state = {
            channel_id: SettingsRepository.getSetting("starboard_channel_id", ""),
            enabled: SettingsRepository.getSetting("starboard_enabled", 0) == 1,
            gild_count: SettingsRepository.getSetting("starboard_gild_count", 0),
            self_star: SettingsRepository.getSetting("starboard_self_star", 0) == 1,
            star_count: SettingsRepository.getSetting("starboard_star_count", 0)
        };

        this.onChange = this.onChange.bind(this);

        // Save the settings debounced so we don't murder the backend
        this.setSetting = _.debounce(this.setSetting, 300);
    }

    onChange(e) {
        let {name, value, type, checked} = e.target;
        // @ts-ignore
        type === "checkbox" ? this.setState({[name]: checked}) : this.setState({[name]: value});

        type === "checkbox" ? this.setSetting(name, checked) : this.setSetting(name, value);
    }

    setSetting(key, value) {
        SettingsRepository.setSetting("starboard_" + key, value, true);
    }

    render() {
        let starboardChannelSelectors: ReactElement[] = [];
        window.Panel.Server.channels.filter(chan => chan.type == "TEXT").forEach(chan => {
            starboardChannelSelectors.push(<option key={chan.id} value={chan.id}>#{chan.channel_name}</option>)
        });
        return (
            <div className="row">
                <div className="col-12">
                    <Field>
                        <label>Starboard Channel</label>
                        <select className="form-control" name="channel_id" onChange={this.onChange}
                                value={this.state.channel_id}>
                            <option disabled={true} value={""}>Select a channel</option>
                            {starboardChannelSelectors}
                        </select>
                    </Field>
                </div>
                <div className="col-4">
                    <Field help="The amount of stars for a post to show up on the starboard">
                        <label>Star Count</label>
                        <input type="number" min={0} className="form-control" name="star_count" onChange={this.onChange}
                               value={this.state.star_count}/>
                    </Field>
                </div>
                <div className="col-4">
                    <Field help="The amount of stars required to gild the post">
                        <label>Gild Count</label>
                        <input type="number" min={0} className="form-control" name="gild_account"
                               onChange={this.onChange} value={this.state.gild_count}/>
                    </Field>
                </div>
                <div className="col-4">
                    <Field help="If self staring is enabled, users can star their own messages">
                        <Switch label="Self Star" id="self-star" name="self_star" onChange={this.onChange}
                                checked={this.state.self_star}/>
                    </Field>
                </div>
            </div>
        );
    }
}

interface QuotesState {
    enabled: boolean
}

class Quotes extends Component<{}, QuotesState> {

    constructor(props) {
        super(props);
        this.state = {
            enabled: SettingsRepository.getSetting("quotes_enabled", 0) == 1
        };

        this.updateQuotesEnabled = this.updateQuotesEnabled.bind(this);
    }

    updateQuotesEnabled(e) {
        this.setState({
            enabled: e.target.checked
        });
        SettingsRepository.setSetting("quotes_enabled", e.target.checked, true);
    }

    render() {
        let quoteCmd = SettingsRepository.getSetting("cmd_discriminator", "!") + "quote <id>";
        return (
            <div className="row">
                <div className="col-12">
                    <p>The starboard is disabled. Users can react with 🗨 to create quotes.</p>
                    <p>Quotes can be retrieved with the command <code>{quoteCmd}</code></p>
                </div>
                <div className="col-12">
                    <Switch label="Enable Quoting" id="enable-quotes" checked={this.state.enabled}
                            onChange={this.updateQuotesEnabled}/>
                </div>
            </div>
        )
    }
}


interface StarboardWrapperState {
    enabled: boolean,
}

export default class StarboardWrapper extends Component<{}, StarboardWrapperState> {
    constructor(props) {
        super(props);
        this.state = {
            enabled: SettingsRepository.getSetting("starboard_enabled", 0) == 1
        };

        this.changeStarboard = this.changeStarboard.bind(this);
    }

    changeStarboard(e) {
        let checked = e.target.checked;
        this.setState({
            enabled: checked
        });
        SettingsRepository.setSetting("starboard_enabled", checked, true);
    }

    render() {
        let toDisplay = this.state.enabled ? <Starboard/> : <Quotes/>;
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h2>Starboard</h2>
                        <p>
                            If the starboard is enabled, reacting via 🗨️ will no longer create new quotes.
                        </p>
                        <Switch label="Enable Starboard" id="enable-starboard" onChange={this.changeStarboard}
                                checked={this.state.enabled}/>
                    </div>
                </div>
                {toDisplay}
            </div>
        )
    }
}