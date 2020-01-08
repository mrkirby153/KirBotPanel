import React from 'react';
import {DashboardInput} from "../../DashboardInput";
import {useGuildSetting} from "../utils/hooks";

const BotNick: React.FC = () => {
    const [nick, setNick] = useGuildSetting(window.Panel.Server.id, 'bot_nick', "", true);

    return (<div>
        <h2>
            Bot Nickname
        </h2>
        <p>
            Sets the bot's nickname
        </p>
        <DashboardInput type="text" name="nick" className="form-control" value={nick}
                        onChange={e => setNick(e.target.value)}/>
    </div>)
};

export default BotNick;