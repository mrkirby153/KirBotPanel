import React, {ReactElement} from 'react'
import {DashboardSelect} from "../../DashboardInput";
import {useGuildSetting} from "../utils/hooks";

const MutedRole: React.FC = () => {

    const [mutedRole, setMutedRole] = useGuildSetting(window.Panel.Server.id, 'muted_role', '', true);

    const roles: ReactElement[] = [];
    window.Panel.Server.roles.forEach(role => {
        roles.push(<option value={role.id} key={role.id}>{role.name}</option>)
    });

    return (
        <React.Fragment>
            <h2>Muted Role</h2>
            <p>
                Select the role that will be applied to the user if they are muted
            </p>
            <DashboardSelect className="form-control" onChange={e => setMutedRole(e.target.value)} value={mutedRole}>
                <option value={""}>None</option>
                {roles}
            </DashboardSelect>
        </React.Fragment>
    )
};
export default MutedRole;