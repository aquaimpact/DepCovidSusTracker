import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ProfileModal from '../ProfileModal'

let that

const options = {
    onRowClick: function(row) {
        fetch(`https://internshipcsit.herokuapp.com/getProfile?IDs=${row.UID}`).then((r) => r.json()).then((data) => {that.databack(data)}).catch(err => {console.log(err)})
    }
};

function Table3(props){
    that = props

    if(props.type === "CC"){
        return(
            <div style={{display:props.display}}>
                <BootstrapTable data={ props.tableprops } options={ options }>
                    <TableHeaderColumn dataField='caseNumber'>Case Number</TableHeaderColumn>
                    <TableHeaderColumn dataField='UID' isKey>User ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='place'>Place At</TableHeaderColumn>
                    <TableHeaderColumn dataField='datetime'>Date and Time</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
    else{
        return(
            <div style={{display:props.display}}>
                <BootstrapTable data={ props.tableprops } options={ options }>
                    <TableHeaderColumn dataField='UID' isKey>User ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='place'>Place At</TableHeaderColumn>
                    <TableHeaderColumn dataField='datetime'>Date and Time</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

export default Table3