import React from 'react';
import Field from "../../Field";
import {DashboardInput} from "../../DashboardInput";
import {useGuildSetting} from "../utils/hooks";

const CommandPrefix: React.FC = () => {

    const [prefix, setPrefix] = useGuildSetting(window.Panel.Server.id, 'command_prefix', '!', true);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-12">
                    <Field>
                        <label htmlFor="commandPrefix"><b>Command Prefix</b></label>
                        <DashboardInput type="text"
                                        className="form-control"
                                        id="commandPrefix"
                                        required={true}
                                        value={prefix}
                                        onChange={e => setPrefix(e.target.value)}
                        />
                    </Field>
                </div>
                <div className="col-lg-6 col-sm-12">
                    <h5>Example Command</h5>
                    <code>{prefix}play https://www.youtube.com/watch/dQw4w9WgXcQ</code>
                </div>
            </div>
        </React.Fragment>
    )
};

export default CommandPrefix;