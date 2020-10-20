import React, {useState} from 'react'
import * as rb from 'react-bootstrap'
import Table3 from './Tables/Table3'
import { IFrame } from './iframe'
import Maps from './maps';
import TimelineChart from './Timelines/TimelineChart'

class ProfileModal extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            datas:[],
            enter:"",
            leave:"",
        }
    }

    // For the Map
    myCallback = (dataFromChild) => {
        // console.log("Datafrmchile:" + dataFromChild)
        this.setState({datas:dataFromChild.data})
        this.setState({enter:dataFromChild.enter})
        this.setState({leave:dataFromChild.leave})
    }

    tableCallback = (dataFromChild) => {
        
    }

    convertSQLDate(startDate1, endDate, type = undefined){
        
        if(startDate1 !== undefined && endDate !== undefined){
            var date = new Date(startDate1)
            var date2 = date.toString().split(" ")
            var time = date2[4].split(":")
    
            var date1 = new Date(endDate)
            var date21 = date1.toString().split(" ")
            var time1 = date21[4].split(":")
            
            let str
            if(type === "header"){
                str = time[0] + ":"+ time[1] + " - " + time1[0] + ":" + time1[1]
            }
            else{
                str = date2[2] + " " + date2[1] + ", " + time[0] + ":"+ time[1] + " - " + time1[0] + ":" + time1[1]
            }
           
            return str
        }
        // return date2[1]
    }

    render(){

        let mappingsCC = this.state.datas.filter(data => data.caseNumber !== null).map(data => {
            return({
                caseNumber:data.caseNumber,
                UID:data.peopleProfileId,
                name:data.firstName + " " + data.lastName,
                place:data.locationShortaddress,
                datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
            })
        })

        let mappingsPATP = this.state.datas.filter(data => data.caseNumber === null).map(data =>{
            return({
                UID:data.peopleProfileId,
                name:data.firstName + " " + data.lastName,
                place:data.locationShortaddress,
                datetime:this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
            })
        })

        let main = this.state.datas[0]
        let placename
        let time
        

        if(main != undefined){
            placename = main.locationShortaddress
            if(this.state.enter !== "" && this.state.leave !== ""){
                time = this.convertSQLDate(this.state.enter, this.state.leave, "header")
            }
        }
       
        return(
            <div>
                <text style={{fontSize:"20px", color:"#424761"}}><b>Name:</b> {this.props.profile.firstName + " " + this.props.profile.lastName}</text>
                <br/>

                <text style={{fontSize:"20px", color:"#424761"}}><b>Gender:</b> {this.props.profile.gender}</text>
                <br/>

                <text style={{fontSize:"20px", color:"#424761"}}><b>Case Number:</b> {this.props.profile.caseNumber}</text>
                <br/>

                <text style={{fontSize:"20px", color:"#424761"}}><b>Marital Status:</b> {this.props.profile.maritalStatus}</text>
                <br/>

                <text style={{fontSize:"20px", color:"#424761"}}><b>Phone Number:</b> {this.props.profile.phoneNumber}</text>
                <br/>

                <text style={{fontSize:"20px", color:"#424761"}}><b>Company:</b> {this.props.profile.company}</text>
                <br/>
                <br/>

                <text style={{fontSize:"30px", color:"#424761"}}><b>Movement Visualisation:</b></text>
                <br/>
                <Maps UID={this.props.profile.id} callbackFromParent={this.myCallback}/>
                <br/>

                <text style={{fontSize:"30px", color:"#424761"}}><b>Timeline:</b></text>
                <br/>
                <TimelineChart UID={this.props.profile.id}/>

                <text style={{fontSize:"30px", color:"#424761"}}><b>Breakdown of movement:</b> <text style={{fontSize:"20px", color:"#424761"}}><rb.Badge>{placename}</rb.Badge></text>{' '} <text style={{fontSize:"20px", color:"#424761"}}><rb.Badge>{time}</rb.Badge></text></text>
                <br/>

                <rb.Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                    <rb.Tab eventKey="home" title="CONFIRMED CASES">
                        <div style={{textAlign: "left", height:"100%"}}>
                            {/* <Chip label="Basic" /> */}
                            {/* PlaceName */}
                            {/* {this.state.placename} */}
                            {/* Time Span */}
                            {/* {this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")} */}
                            <Table3 tableprops={mappingsCC} type = "CC" databack={this.tableCallback()}/>
                        </div>
                    </rb.Tab>

                    <rb.Tab eventKey="contact" title="PUBLIC AT THE PLACE">
                        <div style={{textAlign: "left", height:"100%"}}>
                            {/* PlaceName */}
                            {/* {this.state.placename} */}
                            {/* Time Span */}
                            {/* {this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")} */}
                            <Table3 tableprops={mappingsPATP} type="PATP" databack={this.tableCallback()}/>
                        </div>
                    </rb.Tab>
                </rb.Tabs> 
            </div>
        )
    }
   
}

export default ProfileModal
