import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import * as Actions from './actions';
import ReactTable from "react-table";
import {useTypedSelector} from "../reducers";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import toastr from 'toastr';


const RaidTable: React.FC = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.getPastRaids());
    }, []);

    const raids = useTypedSelector(store => store.antiraid.raids);

    const columns = [
        {
            Header: 'ID',
            accessor: 'id',
            filterable: true
        },
        {
            Header: 'Timestamp',
            accessor: 'timestamp'
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
    return <ReactTable columns={columns} data={raids} className="-striped -highlight pointer" defaultPageSize={10}
                       SubComponent={row => {
                           let ids = row.original.members.map(member => member.id).join(", ");
                           return (
                               <div style={{padding: '10px'}}>
                                   <CopyToClipboard text={ids}
                                                    onCopy={() => toastr.success(`${row.original.member_count} IDs copied`)}>
                                       <button className="btn btn-success mb-3">Copy IDs</button>
                                   </CopyToClipboard>
                                   <ReactTable columns={subColumns} data={row.original.members}
                                               className="-striped -highlight"
                                               defaultPageSize={5}/>
                               </div>
                           )
                       }}/>
};

const PastRaids: React.FC = () => {
    return (
        <React.Fragment>
            <i className="mb-2">Raid reports are kept for a maximum of 30 days after the raid.</i>
            <RaidTable/>
        </React.Fragment>
    )
};

export default PastRaids;