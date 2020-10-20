import React, { useRef, useState } from 'react'
import * as rb from 'react-bootstrap'
import {ReactComponent as Logo} from '../Imgs/upload.svg'
import Papa from 'papaparse'

let namePerson = ["None"]

function readFile(event){

    let file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Use reader.result
            const lols = Papa.parse(reader.result, {
                header: true
                });
            lols.data.forEach(name => {
                namePerson.push(name.Name)
            });
        }
        reader.readAsText(file)
    }
}


function TopNavBar(){

    const inputFile = useRef(null) 

    let suspected = namePerson.map(sus => <rb.NavDropdown.Item eventKey={sus}>{sus}</rb.NavDropdown.Item>)

    const onButtonClick = () => {
        // `current` points to the mounted file input element
       inputFile.current.click();
      };
    return (
        <rb.Navbar bg="white">
                <rb.Navbar.Brand style={{fontSize:30}}>
                    Filter:
                </rb.Navbar.Brand>
                <rb.Navbar.Toggle />
                <rb.Nav onSelect={(eventKey) => this.dropdownClicked(eventKey)}>
                    <rb.NavDropdown title="None">
                        {suspected}
                    </rb.NavDropdown>
                </rb.Nav>
                <rb.Navbar.Collapse className="justify-content-end">
                    <rb.Button className="text-right" id="importCases" style={{textSize:15}} onClick={onButtonClick}>
                        <Logo style={{width:30, height:30, paddingRight:7.4}} id="uploadLogo"/>
                        IMPORT SUSPECTED CASES
                    </rb.Button>
                    <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={readFile}/>
                </rb.Navbar.Collapse>
            </rb.Navbar>
    )
}

export default TopNavBar