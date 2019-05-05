import React, {Component} from 'react';
import ReactTable from 'react-table';
import axios from 'axios';

import 'react-table/react-table.css'
import Modal from "../Modal";
import './infractions/infractions.scss'

interface Infraction {
    id: number,
    created_at: string,
    expires_at: string,
    guild: string,
    active: boolean,
    issuer: string,
    metadata: null | string,
    moderator: {
        id: string,
        username: string,
        discriminator: number
    },
    reason: string,
    type: string,
    user: {
        id: string,
        username: string,
        discriminator: number
    }
}

interface InfractionsState {
    infractions: Infraction[],
    details_visible: boolean,
    viewing_infraction: Infraction | null
}

interface InfTableRow {
    title: string,
    value: any
}

const InfractionTableRow = (props: InfTableRow) => <tr>
    <td>{props.title}</td>
    <td>{props.value}</td>
</tr>;

export default class Infractions extends Component<{}, InfractionsState> {
    constructor(props) {
        super(props);

        this.state = {
            infractions: [],
            details_visible: false,
            viewing_infraction: null
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(): void {
        axios.get('/api/guild/' + window.Panel.Server.id + '/infractions').then(resp => {
            this.setState({
                infractions: resp.data
            })
        })
    }

    openModal(inf) {
        this.setState({
            viewing_infraction: inf,
            details_visible: true
        })
    }

    closeModal() {
        this.setState({
            details_visible: false
        })
    }

    render() {
        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                filterable: true
            },
            {
                Header: 'User',
                columns: [
                    {
                        Header: 'Tag',
                        id: 'user-usernameDiscrim',
                        accessor: d => d.user ? d.user.username + '#' + d.user.discriminator : 'Unknown',
                        sortable: false
                    },
                    {
                        Header: 'User ID',
                        accessor: 'user.id',
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
                        accessor: d => d.moderator ? d.moderator.username + '#' + d.moderator.discriminator : 'Unknown',
                        sortable: false
                    },
                    {
                        Header: 'User ID',
                        accessor: 'moderator.id',
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
                accessor: d => d.active ? 'Active' : 'Inactive',
                sortable: false
            },
            {
                Header: 'Timestamp',
                accessor: 'created_at'
            },
            {
                Header: 'Expires At',
                id: 'expiresAt',
                accessor: d => d.expires_at ? d.expires_at : 'Never'
            }

        ];

        return (
            <div>
                <ReactTable columns={columns} data={this.state.infractions}
                            getTdProps={(state, rowInfo, column, instance) => {
                                return {
                                    onClick: () => {
                                        this.openModal(rowInfo.original)
                                    }
                                }
                            }} className={"-striped -highlight pointer"}/>
                {this.state.viewing_infraction &&
                <Modal title={'Infraction ' + this.state.viewing_infraction.id} open={this.state.details_visible}
                       onClose={this.closeModal}>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th className="col-xs-1"/>
                            <th className="col-xs-11"/>
                        </tr>
                        </thead>
                        <tbody>
                        <InfractionTableRow title="ID" value={this.state.viewing_infraction.id}/>
                        <InfractionTableRow title="Moderator"
                                            value={this.state.viewing_infraction.moderator ? this.state.viewing_infraction.moderator.username + '#' + this.state.viewing_infraction.moderator.discriminator : ''}/>
                        <InfractionTableRow title="User"
                                            value={this.state.viewing_infraction.user ? this.state.viewing_infraction.user.username + '#' + this.state.viewing_infraction.user.discriminator : ''}/>
                        <InfractionTableRow title="Type" value={this.state.viewing_infraction.type}/>
                        <InfractionTableRow title="Reason" value={this.state.viewing_infraction.reason}/>
                        <InfractionTableRow title="Active" value={this.state.viewing_infraction.active? 'Yes' : 'No'}/>
                        <InfractionTableRow title="Created At" value={this.state.viewing_infraction.created_at}/>
                        <InfractionTableRow title="Expires At" value={this.state.viewing_infraction.expires_at}/>
                        </tbody>
                    </table>
                </Modal>}
            </div>
        )
    }
}