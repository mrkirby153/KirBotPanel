import React from 'react';
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

const Infractions: React.FC = () => {

    const dispatch = useDispatch();

    const infractions = useTypedSelector(state => state.infractions);

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
                    accessor: (d: Infraction) => d.username? `${d.username}#${d.discriminator}` : 'Unknown',
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
        <div>
            <ReactTable columns={columns} data={infractions.data}
                        getTdProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: () => {
                                    // this.openModal(rowInfo.original)
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
        </div>
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