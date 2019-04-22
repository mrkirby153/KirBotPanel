import React, {Component} from 'react';
import JsonSettings from "./spam/JsonSettings";
import {SpamSchema, CensorSchema} from './spam/Schemas';

export default class Spam extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Spam Settings</h2>
                <p>
                    <b>Available Rules</b><br/>
                    The following rules are available for each clearance level: <code>max_messages, max_newlines,
                    max_mentions, max_links, max_emoji, max_uppercase, max_attachments</code>. Each rule has two
                    options: <code>count and period</code>. "Count" is the number of violations that trigger action,
                    "period" is teh time (in seconds) in which the bot looks.
                </p>
                <p className="mb-0">
                    <b>Available Actions</b><br/>
                    The following actions are available and can be set with the <code>punishment</code> string in teh
                    root of the element. For temporary actions, provide a <code>punishment_duration</code> in seconds
                </p>
                <ul>
                    <li><b>None: </b>Take no action</li>
                    <li><b>MUTE: </b>Permanently mute the user</li>
                    <li><b>KICK: </b>Kick the user from the server</li>
                    <li><b>BAN: </b>Ban the user form the server</li>
                    <li><b>TEMPBAN: </b>Temporarily ban the user from the server</li>
                    <li><b>TEMPMUTE: </b>Temporarily mute the user</li>
                </ul>
                <JsonSettings schema={SpamSchema} settingsKey="spam_settings"/>
                <hr/>
                <h2>Censor Settings</h2>
                <p className="mb-0">
                    <b>Available Rules:</b>
                </p>
                <ul>
                    <li><b>Invites: </b>Censor invites. Keys: <code>enabled, whitelist, guild_whitelist, blacklist, guild_blacklist</code></li>
                    <li><b>Domains: </b>Censor domains. Keys: <code>enabled, whitelist, blacklist</code></li>
                    <li><b>blocked_tokens: </b>Blocks tokens (can appear in the word anywhere) [array]</li>
                    <li><b>blocked_words: </b>Blocked words (words separated by a space) [array]</li>
                    <li><b>zalgo: </b>Block Zalgo text from being sent [boolean]</li>
                </ul>
                <JsonSettings schema={CensorSchema} settingsKey="censor_settings"/>
            </div>
        )
    }
}