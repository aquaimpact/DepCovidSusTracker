import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const selectRowProp = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: onRowSelect,
    onSelectAll: onSelectAll
};

let that

let selectedrows = []


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

function Table2(props){
    that = props
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

export default Table2