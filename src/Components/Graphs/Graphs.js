import React from 'react'
import * as rb from 'react-bootstrap'
import {useState} from 'react'
import Chart from "react-apexcharts";

function Graph(props){

    return(
        <div style={{display:props.display, height:"100%", width:"100%"}}>
            
            {/* <div style={{border:"1px solid #000000", borderRadius:"15px",display:"inline-block", backgroundColor:"#FFFFFF", margin:"10px"}}>
                <Chart options={props.options} series={props.series} type="rangeBar" height={613} width={500}/>
            </div> */}
            <div style={{width:"inherit", height:"300px"}}>
                <Chart options={props.options} series={props.series} type="rangeBar" height="100%" width="100%"/>
            </div>
            
            

        </div>
    )
    
}

export default Graph