import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ProfileModal from '../ProfileModal'

const selectRowProp = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: onRowSelect,
    onSelectAll: onSelectAll
};

let that

let selectedrows = []

const options = {
    onRowClick: function(row) {
        fetch(`https://internshipcsit.herokuapp.com/getProfile?IDs=${row.UID}`).then((r) => r.json()).then((data) => {that.databack(data)}).catch(err => {console.log(err)})
    }
};

function onRowSelect(row, isSelected, e) {
    // let rowStr = '';
    if(isSelected){
        selectedrows.push(row["UID"])
    }
    else{
        selectedrows = selectedrows.filter(x => x !== row["UID"])
    }
    // console.log(selectedRows);
    that.callbackFromParent(selectedrows);
    // alert(`is selected: ${isSelected}, ${rowStr}`);
}

function onSelectAll(isSelected, rows) {
    
    if(isSelected){
        for (let i = 0; i < rows.length; i++) {
            selectedrows.push(rows[i].UID)
        }
    }
    else{
        for (let i = 0; i < rows.length; i++) {
            selectedrows = selectedrows.filter(x => x !== rows[i].UID)
        }
        
    }
    // console.log(selectedRows);
    that.callbackFromParent(selectedrows);
}

function Table(props){
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
        if(props.type === "modal-edit"){
            return(
                <div style={{display:props.display}}>
                    <BootstrapTable data={ props.tableprops } selectRow={ selectRowProp }>
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
    
}

export default Table