import React from 'react'
// import Timeline from 'react-image-timeline';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import './style.css'
import TimelineTable from '../Tables/Timeline/TimelineTable'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
 
const moment = extendMoment(Moment);


class TimelineChart extends React.Component{

    constructor(props){
        
        super(props)
        this.state = {
            movements: [],
            retrieved: [],
        }

    }

    getMovements(id){
        fetch(`https://internshipcsit.herokuapp.com/getMovementbyID?IDs=${id}`).then(r => r.json()).then(data => {
            this.setState({movements:data})
            data.forEach(x => {
                this.getPeople(x.id)
            })
        }).catch(err => {console.log(err)})
    }

    componentDidMount(){
        this.getMovements(this.props.UID)
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

    getPeople(id)
    {
        fetch(`https://internshipcsit.herokuapp.com/getPeopleTiming?IDs=${id}`).then(r => r.json()).then((data) => {this.setState({ retrieved: [...this.state.retrieved, data]})}).catch(err => {console.log(err)})
    }

    render(){

        let count = 0

        let events = this.state.movements.map(x => {

            let range = moment.range(x.datetimeEntered, x.datetimeLeft)

            let tableprops
            if(this.state.retrieved[count] !== undefined){
                tableprops = this.state.retrieved[count].map(data => {

                    let range2 = moment.range(data.datetimeEntered, data.datetimeLeft)
                    let minIntersect = range.intersect(range2).diff('minute')

                    return({
                        name: data.firstName + " " + data.lastName,
                        datetime: this.convertSQLDate(data.datetimeEntered, data.datetimeLeft),
                        intersectTime: minIntersect + " min",
                        intersection: ""
                    })
                })
            }
           
            count += 1
            return(
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={"Date: " + this.convertSQLDate(x.datetimeEntered, x.datetimeLeft)}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}>

                    {/* <h3 className="vertical-timeline-element-title">{x.locationShortaddress}</h3> */}

                    <h4 className="vertical-timeline-element-subtitle">{x.locationShortaddress}</h4>
                    <br/>
                    <TimelineTable tableprops={tableprops}/>
                </VerticalTimelineElement>
            )
        })

        return(
            <div style={{backgroundColor:"#FFFFFF"}}>
                <VerticalTimeline layout="1-column">
                    {events}
                </VerticalTimeline>
            </div>
        )

    }

}

export default TimelineChart