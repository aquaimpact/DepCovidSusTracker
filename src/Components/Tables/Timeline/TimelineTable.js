import React, { useRef } from 'react'
import * as rb from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ProfileModal from '../../ProfileModal'
import './style.css'

const options = {
    onRowClick: function(row) {
        // fetch(`http://localhost:8080/getProfile?IDs=${row.UID}`).then((r) => r.json()).then((data) => {that.databack(data)}).catch(err => {console.log(err)})
    }
};

function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
    // fieldValue is column value
    // row is whole row object
    // rowIdx is index of row
    // colIdx is index of column
    // console.log()
    let time = parseInt(row.intersectTime.split(" ")[0])

    if(time >= 30){
        return 'error'
    }
    else if( time >= 15){
        return 'minor'
    }
    else{
        return 'noError'
    }
}

function TimelineTable(props){
    return(
        <div style={{display:props.display}} tableStyle>
            <BootstrapTable data={ props.tableprops } options={ options }>
                <TableHeaderColumn dataField='name' isKey>Name</TableHeaderColumn>
                <TableHeaderColumn dataField='datetime'>Date and Time</TableHeaderColumn>
                <TableHeaderColumn dataField='intersectTime'>Intersection Time</TableHeaderColumn>
                <TableHeaderColumn dataField='intersection' columnClassName={ columnClassNameFormat }>Intersection Status</TableHeaderColumn>
                
            </BootstrapTable>
        </div>
    )
}

export default TimelineTable