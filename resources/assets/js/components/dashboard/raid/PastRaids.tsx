import React, {Component} from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import toastr from 'toastr';
import {CopyToClipboard} from 'react-copy-to-clipboard';

interface PastRaidsState {
    raids: Raid[]
}

interface Raid {
    timestamp: string,
    member_count: number,
    id: string,
    members: RaidMember[]
}

interface RaidMember {
    name: string,
    id: string
}

export default class PastRaids extends Component<{}, PastRaidsState> {
    constructor(props) {
        super(props);
        this.state = {
            raids: []
        }
    }

    componentDidMount(): void {
        axios.get('/api/guild/' + window.Panel.Server.id + '/raids').then(resp => {
            this.setState({
                raids: resp.data
            })
        })
    }

    render() {
        if (this.state.raids.length == 0) {
            return <i>No raids have been recorded. Recent raids will appear here.</i>
        } else {
            return (
                <div>
                    <i className="mb-1">Raid reports are kept for a maximum of 30 days after the raid <br/> Click a row
                        to copy the member ids to your clipboard</i>
                    <RaidTable raids={this.state.raids}/>
                </div>
            )
        }
    }
}


interface RaidTableProps {
    raids: Raid[]
}

class RaidTable extends Component<RaidTableProps, {}> {
    constructor(props) {
        super(props);

    }


    copyDataToClipboard(data: Raid) {
        let ids = data.members.map(member => member.id).join('\n');
        let txt = document.createElement("textarea");
        // txt.style.display = "none";
        document.body.appendChild(txt);
        txt.value = ids;
        txt.select();
        document.execCommand("copy");
        setTimeout(() => {
            document.body.removeChild(txt)
        }, 250);
        toastr.success(data.member_count + ' members copied to your clipboard')
    }

    render() {
        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                filterable: true
            },
            {
                Header: 'Timestamp',
                accessor: 'timestamp',
            },
            {
                Header: 'Members',
                accessor: 'member_count'
            }
        ];

        const subColumns = [
            {
                Header: 'User ID',
                accessor: 'id',
                sortable: false
            },
            {
                Header: 'Name',
                accessor: 'name',
                sortable: false
            }
        ];

        return (
            <ReactTable columns={columns} data={this.props.raids} className={"-striped -highlight pointer"}
                        SubComponent={row => {
                            let ids = row.original.members.map(member => member.id).join('\n');
                            return (
                                <div style={{padding: '10px'}}>
                                    <CopyToClipboard text={ids}
                                                     onCopy={() => toastr.success(row.original.member_count + ' IDs copied')}>
                                        <button className="btn btn-success mb-3">Copy Data</button>
                                    </CopyToClipboard>
                                    <ReactTable columns={subColumns} data={row.original.members}
                                                className={"-striped -highlight"} defaultPageSize={5}/>
                                </div>
                            )
                        }}/>
        );
    }

}