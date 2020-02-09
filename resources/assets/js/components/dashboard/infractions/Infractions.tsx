import React, {useState} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import './infractions.scss'
import {Tab} from "../tabs";
import rootSaga from "./saga";
import reducer from "./reducer";
import {useDispatch} from "react-redux";
import * as Actions from './actions';
import {useTypedSelector} from "../reducers";
import {Infraction} from "./types";
import Modal from "../../Modal";


interface InfractionTableRowProps {
    title: string,
    value: any
}

const InfractionTableRow: React.FC<InfractionTableRowProps> = (props) => {
    return <tr>
        <td>{props.title}</td>
        <td>{props.value}</td>
    </tr>
};

interface InfractionDetailsModelProps {
    infraction: Infraction
    onClose: Function
}

const InfractionDetailsModel: React.FC<InfractionDetailsModelProps> = (props) => {
    let infraction = props.infraction;
    let modUsername = infraction.mod_username ? `${infraction.mod_username}#${infraction.mod_discrim} (${infraction.mod_id})` : infraction.mod_id;
    let username = infraction.username ? `${infraction.username}#${infraction.discriminator} (${infraction.user_id})` : infraction.user_id;
    return (
        <Modal title={'Infraction ' + infraction.inf_id} open={true} onClose={props.onClose} closeButton>
            <table className="table table-striped table-bordered table-hover">
                <thead>
                <tr>
                    <th className="col-xs-1"/>
                    <th className="col-xs-11"/>
                </tr>
                </thead>
                <tbody>
                <InfractionTableRow title="ID" value={infraction.inf_id}/>
                <InfractionTableRow title="Moderator" value={modUsername}/>
                <InfractionTableRow title="User" value={username}/>
                <InfractionTableRow title="Type" value={infraction.type}/>
                <InfractionTableRow title="Reason" value={infraction.reason}/>
                <InfractionTableRow title="Active" value={infraction.active ? 'Yes' : 'No'}/>
                <InfractionTableRow title="Created At" value={infraction.inf_created_at}/>
                <InfractionTableRow title="Expires At" value={infraction.expires_at || 'Never'}/>
                </tbody>
            </table>
        </Modal>
    )
};


const Infractions: React.FC = () => {

    const dispatch = useDispatch();

    const infractions = useTypedSelector(state => state.infractions);

    const [viewingInfraction, setViewingInfraction] = useState<Infraction | null>(null);

    const columns = [
        {
            Header: 'ID',
            accessor: 'inf_id',
            filterable: true
        },
        {
            Header: 'User',
            columns: [
                {
                    Header: 'Tag',
                    id: 'user-usernameDiscrim',
                    accessor: (d: Infraction) => d.username ? `${d.username}#${d.discriminator}` : 'Unknown',
                    sortable: false
                },
                {
                    Header: 'User ID',
                    accessor: 'user_id',
                    filterable: true
                }
            ]
        },
        {
            Header: 'Moderator',
            columns: [
                {
                    Header: 'Tag',
                    id: 'moderator-userNameDiscrim',
                    accessor: (d: Infraction) => d.mod_id ? `${d.mod_username}#${d.mod_discrim}` : 'Unknown',
                    sortable: false
                },
                {
                    Header: 'User ID',
                    accessor: 'mod_id',
                    filterable: true
                }
            ]
        },
        {
            Header: 'Type',
            accessor: 'type',
            filterable: true
        },
        {
            Header: 'Reason',
            accessor: 'reason',
            filterable: true,
            sortable: false
        },
        {
            Header: 'Active',
            id: 'active',
            accessor: (d: Infraction) => d.active == 1 ? 'Active' : 'Inactive',
            sortable: false
        },
        {
            Header: 'Timestamp',
            accessor: 'inf_created_at'
        },
        {
            Header: 'Expires At',
            id: 'expires_at',
            accessor: (d: Infraction) => d.expires_at || 'Never'
        }
    ];

    return (
        <React.Fragment>
            <ReactTable columns={columns} data={infractions.data}
                        getTdProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: () => {
                                    setViewingInfraction(rowInfo.original)
                                }
                            }
                        }} className={"-striped -highlight pointer"}
                        defaultPageSize={10}
                        manual
                        loading={infractions.loading}
                        showPagination={true}
                        showPaginationTop={false}
                        showPaginationBottom={true}
                        pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                        onFetchData={(state, instance) => {
                            dispatch(Actions.getInfractions(state.page, state.pageSize, state.sorted, state.filtered))
                        }}
                        pages={infractions.max_pages}/>
            {viewingInfraction &&
            <InfractionDetailsModel infraction={viewingInfraction}
                                    onClose={() => setViewingInfraction(null)}/>}
        </React.Fragment>
    )
};

const tab: Tab = {
    key: 'infractions',
    name: 'Infractions',
    icon: 'exclamation-triangle',
    route: {
        path: '/infractions',
        component: Infractions
    },
    saga: rootSaga,
    reducer: reducer
};
export default tab