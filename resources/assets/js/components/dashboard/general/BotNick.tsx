import React, {Component} from 'react';
import Form from "../../Form";
import Field from "../../Field";
import axios from 'axios';
import SettingsRepository from "../../../settings_repository";
import Timeout = NodeJS.Timeout;


interface BotNickState {
    success: boolean,
    errors: any[],
    busy: boolean,
    nick: string,
}

export default class BotNick extends Component<{}, BotNickState> {
    private timer: Timeout | null;

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            errors: [],
            busy: false,
            nick: SettingsRepository.getSetting('bot_nick', "")
        };
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.timer = null;
    }

    handleChange(e) {
        this.clearErrors(e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        } as Pick<BotNickState, keyof BotNickState>)
    }

    clearErrors(name: string) {
        let errs = [...this.state.errors];
        delete errs[name];
        this.setState({
            errors: errs
        });
    }

    save() {
        if (this.timer)
            clearTimeout(this.timer);
        this.setState({
            busy: true,
            success: false,
            errors: []
        });
        axios.post('/api/guild/' + window.Panel.Server.id + '/bot-nick', {
            nick: this.state.nick
        }).then(resp => {
            this.setState({
                busy: false,
                success: true
            });
            SettingsRepository.setSetting('bot_nick', this.state.nick);
            this.timer = setTimeout(() => {
                this.setState({
                    success: false
                })
            }, 2500);
        }).catch(e => {
            this.setState({
                busy: false,
                errors: e.response.data.errors || []
            });
        })
    }

    render() {
        return (
            <div>
                <h2>
                    Bot Nickname
                </h2>
                <p>
                    Sets the bot's nickname
                </p>
                <Form busy={this.state.busy} onSubmit={this.save}>
                    <Field success={this.state.success ? "Name has been updated" : null}
                           errors={this.state.errors['nick']}>
                        <input type="text" name="nick" className="form-control" value={this.state.nick}
                               onChange={this.handleChange} onBlur={this.save}/>
                    </Field>
                </Form>
            </div>
        );
    }

}