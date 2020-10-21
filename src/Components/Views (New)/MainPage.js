import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import Papa from 'papaparse'
import MainMap from '../MainMap';
import Graph from '../Graphs/Graphs'
import Table from '../Tables/Table'
import Table2 from '../Tables/Table2'
import * as rb from 'react-bootstrap'
import ProfileModal from '../ProfileModal'
import Footer from './Footers/Footer'

// reactstrap components
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardImg,
	FormGroup,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Container,
	Row,
	Col,
	NavItem,
	NavLink,
	Nav,
	TabContent,
	TabPane,
	UncontrolledTooltip,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
} from "reactstrap";

// core components
import DemoNavbar from "./Navbars/DemoNavbar.js";


let testing

class MainPage extends React.Component {
	constructor(props) {
		super(props);

		this.uploadFile = this.uploadFile.bind(this);
		this.uploadFile2 = this.uploadFile2.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleClick2 = this.handleClick2.bind(this);
		this.getlegends = this.getlegends.bind(this);
		this.legends = {};
		this.state = {
			dropDownValue: "All Suspects",
			dataList: ["All Suspects"],
			suspectCases: [],
			movements: [],
			error: false,
			errorMsg: "",
			showModal: false,
			filenames: [],
			series: {},
			datas: [],
			placename: "",
			datetime: [],
			showSelection: false,
			CCID: [],
			CloseContacts: {},
			fromCCID: [],
			profileModal: {},
			showSelection2: false,
			mapData: [],
			tabs: 1,

			suspectCasesOriginal: [],
			movementsOriginal: [],
			legends:{},
		}
	}

	componentDidMount() {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
		this.refs.main.scrollTop = 0;
	}

	importCompleted() {
		const list = this.state
		this.props.handleData(list)
		return
	}

	// Suspect Profile File Upload
	handleClick(e) {
		this.refs.fileUploader.click();
	}

	//Suspect Movement File Upload
	handleClick2(e) {
		this.refs.fileUploader2.click();
	}

	// Suspect File Upload
	uploadFile(event) {

		const file = event.target.files[0]

		if (file) {
			if (file.name.includes("_suspected")) {

				this.setState({ filenames: [...this.state.filenames, file.name] })
				const reader = new FileReader();
				reader.onload = () => {
					// Use reader.result
					const lols = Papa.parse(reader.result, { header: true, skipEmptyLines: true })

					// Adds names into dropdown
					this.setState({ dataList: ["All Suspects", ...lols.data.map(names => names.firstName + " " + names.lastName)] })

					const data = lols.data
					this.setState({ suspectCasesOriginal: data,suspectCases: data })
				}
				reader.readAsText(file)
				this.setState({ error: false })
			}
			else {
				this.setState({ error: true, errorMsg: "You have uploaded invalid files! Please rename the file to <filename>_suspected (For suspected cases)" })
				return
			}
		}
	}

	// Movement File Upload
	uploadFile2(event) {

		const file = event.target.files[0]

		if (file) {
			if (file.name.includes("_movements")) {

				this.setState({ filenames: [...this.state.filenames, file.name] })
				const reader = new FileReader();
				reader.onload = () => {
					// Use reader.result
					const lols = Papa.parse(reader.result, { header: true, skipEmptyLines: true })

					// console.log(lols.data)

					// Posting csv data into db
					// this.postData('"' + JSON.stringify(lols.data) + '"')
					// this.postMovements(JSON.stringify(lols.data))
					const data = lols.data
					this.setState({ movementsOriginal: data , movements: data})
				}
				reader.readAsText(file)
				this.setState({ error: false })
			}
			else {
				this.setState({ error: true, errorMsg: "You have uploaded invalid files! Please rename the file to <filename>_movements (For suspected case movement)" })
				return
			}
		}
	}

	dropdownClicked = (e) => {
		
		let originalSus = this.state.suspectCasesOriginal
		let originalMoves = this.state.movementsOriginal
		// this.setState({ })
		if(e.currentTarget.textContent != "All Suspects"){
			// console.log(this.state.suspectCases).filter
			let firstName = e.currentTarget.textContent.split(" ")[0]
			let lastName = e.currentTarget.textContent.split(" ")[1]

			originalSus = originalSus.filter(x => x.firstName == firstName && x.lastName == lastName)

			originalMoves = originalMoves.filter(x => x.suspectId == originalSus[0].id)

		}
		this.setState({suspectCases: originalSus, movements: originalMoves, dropDownValue: e.currentTarget.textContent, datas: [], mapData:[]})
	}

	convertDate(date) {

		var lol = date
		var dateTimeParts = lol.split(' ')
		// console.log(dateTimeParts)
		var dateParts = dateTimeParts[0].split('/')
		var timeParts = dateTimeParts[1].split(':')
		var timeOfDay = dateTimeParts[2]
		if (timeOfDay === "pm") {
			timeParts[0] += 12
		}

		// new Date(year, month, day, hours, minutes, seconds, milliseconds)
		var finalDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]);
		// console.log(finalDate)
		return finalDate.getTime();
	}

	//// ### UNCOMMENT FOR GANTT CHART ###
	// Gantt Chart Data Formatter from movements and suspects
	populateGraph1() {
		let series2 = []

		var strings = this.state.mapData;
		console.log("populateGraph1 : String = ", strings)

		var numbers = strings.match(/\d+/g).map(Number);
		console.log("populateGraph1 : NumberS: ", numbers)

		numbers.forEach(x => {
			let data = []

			let m1 = this.state.movements.filter(moves => moves.id === x.toString())[0]
			let p1 = this.state.suspectCases.filter(sus => sus.id === m1.suspectId)[0]

			data.push(
				{
					x: m1.locationShortaddress,
					y: [this.convertDate(m1.datetimeEntered), this.convertDate(m1.datetimeLeft)]
				}
			)

			series2.push(
				{
					name: p1.firstName + " " + p1.lastName,
					data: data
				}
			)
		})
		return series2
	}

	convertSQLDate(startDate1, endDate, type = undefined) {

		if (startDate1 !== undefined && endDate !== undefined) {
			var date = new Date(startDate1)
			var date2 = date.toString().split(" ")
			var time = date2[4].split(":")

			var date1 = new Date(endDate)
			var date21 = date1.toString().split(" ")
			var time1 = date21[4].split(":")

			let str
			if (type === "header") {
				str = time[0] + ":" + time[1] + " - " + time1[0] + ":" + time1[1]
			}
			else {
				str = date2[2] + " " + date2[1] + ", " + time[0] + ":" + time[1] + " - " + time1[0] + ":" + time1[1]
			}

			return str
		}
		// return date2[1]
	}

	myCallback = (dataFromChild) => {
		// console.log("Data1:" + dataFromChild)
		this.setState({ CCID: dataFromChild })
	}

	myCallback2 = (dataFromChild) => {
		// console.log("Data2:" + dataFromChild)
		this.setState({ fromCCID: dataFromChild })
	}

	databackTable = (dataFromChild) => {

		this.setState({ profileModal: dataFromChild })
		this.setState({ showSelection2: true })
	}

	isEmptyObject(obj) {
		return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	toCCClicked = () => {
		let IDs = []

		if (this.state.datas.length > 0) {
			let placename = this.state.datas[0].locationShortaddress
			this.state.datas.map(x => {
				for (var data of this.state.CCID) {

					if (x.peopleProfileId === data) {
						IDs.push(x.peopleProfileId)
					}
				}

			})

			let newItem = { ...this.state.CloseContacts, [placename]: IDs }

			this.setState({ CloseContacts: newItem })
		}
	}

	compare(arr1, arr2) {

		if (!arr1 || !arr2) return

		let result;

		arr1.forEach((e1, i) => arr2.forEach(e2 => {

			if (e1.length > 1 && e2.length) {
				result = this.compare(e1, e2);
			} else if (e1 !== e2) {
				result = false
			} else {
				result = true
			}
		}))
		return result
	}

	fromCCClicked = () => {

		if (this.state.datas.length > 0) {
			let placename = this.state.datas[0].locationShortaddress
			let IDs = this.state.CloseContacts[placename].filter(x => this.state.fromCCID.includes(x) === false).map(x => { return x })

			let newItem = { ...this.state.CloseContacts, [placename]: IDs }

			this.setState({ CloseContacts: newItem })
		}

	}

	toggleNavs = (e, state, index) => {
		e.preventDefault();
		this.setState({
			[state]: index
		});
	};

	getlegends(getlegend){
		this.legends = getlegend
		// this.forceUpdate()
	}

	dataRetrievedMap = (dataFromChild) => {
		this.setState({ mapData: dataFromChild })
	}

	render() {
		let placename

		// console.log(this.legends)

		let displaySetting2 = this.state.suspectCases.length > 0 && this.state.movements.length > 0 ? "visible" : "hidden"
		let maindp1 = this.state.suspectCases.length > 0 && this.state.movements.length > 0 ? "relative" : "absolute"
		let maindp2 = this.state.suspectCases.length > 0 && this.state.movements.length > 0 ? 0 : -10000

		let ds1 = this.state.mapData.length > 0 ? "visible" : "hidden"
		let ds11 = this.state.mapData.length > 0 ? "relative" : "absolute"
		let ds12 = this.state.mapData.length > 0 ? 0 : -10000

		let ds3 = this.state.datas.length > 0 ? "visible" : "hidden"
		let ds31 = this.state.datas.length > 0 ? "relative" : "absolute"
		let ds32 = this.state.datas.length > 0 ? 0 : -10000

		let displayWarning = this.state.error ? "block" : "none"

		let graph1

		const that = this;

		//// ### UNCOMMENT FOR GANTT CHART ###
		if (this.state.mapData.length !== 0) {
			testing = this.populateGraph1()
		}

		let options
		console.log("is testing undefined? : ", testing !== undefined)
		//// ### UNCOMMENT FOR GANTT CHART ###
		if (testing !== undefined) {

			let lol = function (event, chartContext, config) {
				placename = testing[config.seriesIndex].data[config.dataPointIndex].x
				console.log("placename : ", placename)
				fetch("https://internshipcsit.herokuapp.com/getMovementForDate?placeName=" + testing[config.seriesIndex].data[config.dataPointIndex].x + "&dates=" + testing[config.seriesIndex].data[config.dataPointIndex].y + "&personName=" + testing[config.seriesIndex].name)
					.then(response => response.json()).then(data => that.setState({ 
						datas: data,
						placename: testing[config.seriesIndex].data[config.dataPointIndex].x, 
						datetime: testing[config.seriesIndex].data[config.dataPointIndex].y 
					})).catch(err => { console.log(err); });
			}

			options = {
				options: {
					chart: {
						height: 450,
						type: 'rangeBar',
						events: {
							dataPointSelection: lol
						}
					},
					plotOptions: {
						bar: { horizontal: true, barHeight: '80%' }
					},
					xaxis: {
						type: 'datetime',
						labels: {
							datetimeFormatter:{
								hour: 'HH:mm'
							}
						}
					},
					stroke: {
						width: 1
					},
					fill: {
						type: 'solid',
						opacity: 0.6
					},
					legend: {
						position: 'top',
						horizontalAlign: 'left'
					},
					tooltip: {

					},
				}
			}

			// console.log("Updated")
			// console.log(testing)
			// console.log(options.options)
			graph1 = <Graph display={displaySetting2} options={options.options} series={testing} tool />
		}

		// console.log(this.state.legends)

		// Creating the COnfirmed Cases
		let mappingsCC = this.state.datas.filter(data => data.caseNumber !== null).map(data => {
			return ({
				caseNumber: data.caseNumber,
				UID: data.peopleProfileId,
				name: data.firstName + " " + data.lastName,
				place: data.locationShortaddress,
				datetime: this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
			})
		})

		// Creating the Public at the place List
		let mappingsPATP

		// Checks if there are any close contacts be begin with. If there are none than the below will run
		if (this.isEmptyObject(this.state.CloseContacts)) {
			mappingsPATP = this.state.datas.filter(data => data.caseNumber == null).map(data => {
				return ({
					UID: data.peopleProfileId,
					name: data.firstName + " " + data.lastName,
					place: data.locationShortaddress,
					datetime: this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
				})
			})
		}

		// If you added the close contacts, no need to be for the current place (any place), then the below will run
		else {

			let newlist = []

			this.state.datas.filter(data => data.caseNumber == null).map(data => {

				// Checks if the place that the user has clicked on contains any close contacts assigned to it. If there are, then it will take away all the people that are in the close 
				// contact list from the PATP
				if (this.state.CloseContacts[data.locationShortaddress] != undefined) {
					// console.log("Logged: " + this.state.CloseContacts[placename] + ": " + Array.isArray(this.state.CloseContacts[placename]))
					if (this.state.CloseContacts[data.locationShortaddress].includes(data.peopleProfileId) === false) {
						newlist.push({
							UID: data.peopleProfileId,
							name: data.firstName + " " + data.lastName,
							place: data.locationShortaddress,
							datetime: this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
						})
					}
				}

				// If there isnt any close contacts then it will just return all the people from the PTAP back to PTAP
				else {
					newlist.push({
						UID: data.peopleProfileId,
						name: data.firstName + " " + data.lastName,
						place: data.locationShortaddress,
						datetime: this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
					})
				}
			})

			mappingsPATP = newlist
		}

		//Mapping the Contacts
		let newlist2 = []

		this.state.datas.filter(data => data.caseNumber === null).map(data => {

			if (this.state.CloseContacts[data.locationShortaddress] != undefined) {
				if (this.state.CloseContacts[data.locationShortaddress].includes(data.peopleProfileId)) {
					newlist2.push({
						UID: data.peopleProfileId,
						name: data.firstName + " " + data.lastName,
						place: data.locationShortaddress,
						datetime: this.convertSQLDate(data.datetimeEntered, data.datetimeLeft)
					})
				}
			}
		})

		let mappingsclose = newlist2

		return (
			<>
				<DemoNavbar />
				<main ref="main">
					<div className="position-relative">
						{/* shape Hero */}
						<section className="section section-lg section-shaped pb-250">
							<div className="shape shape-style-1 shape-default">
								<span />
								<span />
								<span />
								<span />
								<span />
								<span />
								<span />
								<span />
								<span />
							</div>
							<Container className="py-lg-md d-flex">
								<div className="col px-0">
									<Row>
										<Col lg="6">
											<h1 className="display-3 text-white">
												Covid - 19 Tracker{" "}
												<span>helps you track your suspects</span>
											</h1>
											<p className="lead text-white">
												This website provides you with the perfect tools needed to
												visualise your suspects  movements and the people that got
												into contact with them.
											</p>
										</Col>
									</Row>
								</div>
							</Container>

							<br />
							<br />

							<Container className="py-lg-md d-flex">
								<div className="col px-0">
									<Row>
										<Col lg="6">
											<h1 className="display-3 text-white">
												Importing Data{" "}
											</h1>
										</Col>
									</Row>
								</div>
							</Container>
							{/* SVG separator */}
							<div className="separator separator-bottom separator-skew">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="none"
									version="1.1"
									viewBox="0 0 2560 100"
									x="0"
									y="0"
								>
									<polygon
										className="fill-white"
										points="2560 0 2560 100 0 100"
									/>
								</svg>
							</div>
						</section>
						{/* 1st Hero Variation */}
					</div>

					{/* IMPORT SECTION */}
					<section className="section section-lg pt-lg-0 mt--200">
						<Container>
							<Row className="justify-content-center">
								<Col lg="12">
									<Row className="row-grid">
										<Col lg="4">
											<Card className="card-lift--hover shadow border-0">
												<CardBody className="py-5">
													<div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
														<i className="ni ni-single-02" />
													</div>
													<h6 className="text-primary text-uppercase">
														Suspected Profiles
													</h6>
													<p className="description mt-3">
														{"Please format you file to <filename>_suspected"}.
													</p>
													<Button className="mt-4" color="primary" onClick={this.handleClick.bind(this)}>
														Import File
													</Button>
													<input type="file" id="file" ref="fileUploader" style={{ display: "none" }} onChange={this.uploadFile} />
												</CardBody>
											</Card>
										</Col>
										<Col lg="4">
											<Card className="card-lift--hover shadow border-0">
												<CardBody className="py-5">
													<div className="icon icon-shape icon-shape-success rounded-circle mb-4">
														<i className="ni ni-map-big" />
													</div>
													<h6 className="text-success text-uppercase">
														Suspected Movements
													</h6>
													<p className="description mt-3">
														{"Please format you file to <filename>_movement"}.
													</p>
													<Button
														className="mt-4"
														color="success"
														href="#pablo"
														onClick={this.handleClick2.bind(this)}
													>
														Import File
													</Button>
													<input type="file" id="file2" ref="fileUploader2" style={{ display: "none" }} onChange={this.uploadFile2} />
												</CardBody>
											</Card>
										</Col>
									</Row>
								</Col>
							</Row>
							<div style={{display:displayWarning}}>
								<br/>
								<div class="alert alert-warning" role="alert">
									{this.state.errorMsg}
								</div>
							</div>
							
						</Container>
					</section>

					{/* <div style={{display:displaySetting2}}> */}
					<div style={{visibility:displaySetting2, position: maindp1, top: maindp2}}>

						{/* MAP SECTION */}
						<section className="section section-lg">
							<Container>
								<Row className="row-grid align-items-center">
									<Row className="justify-content-center text-center mb-lg">
										<Col lg="8">
											<h2 className="display-3">Map</h2>
											<p className="lead text-muted">
												================================================
												<br/>CLICK ON A MARKER AND SCROLL TO GANTT CHART
												================================================
											</p>
											<UncontrolledDropdown group>
												<DropdownToggle caret color="primary">
													{this.state.dropDownValue}
												</DropdownToggle>
												
												<DropdownMenu>
													{
														this.state.dataList.map(x => 
															<DropdownItem onClick={this.dropdownClicked}>
																{x}
															</DropdownItem>
														)
													}
												</DropdownMenu>
											</UncontrolledDropdown>
										</Col>
									</Row>
									<MainMap profile={this.state.suspectCases} movement={this.state.movements} dataRetrieved={this.dataRetrievedMap}/>
								</Row>
							</Container>
						</section>

						<div style={{visibility:ds1, position: ds11, top: ds12}}>
							{/* GANTT CHART SECTION */}
							<section className="section bg-secondary">
								<Container>
									<Row className="row-grid align-items-center">
										<Row className="justify-content-center text-center mb-lg">
											<Col lg="8">
												<h2 className="display-3">Gantt Chart</h2>
												<p className="lead text-muted">
													================================================
													<br />CLICK ON THE GANTT CHART AND SCROLL TO TABLE
													================================================
												</p>
											</Col>
										</Row>
										{graph1}
									</Row>
								</Container>
							</section>

							<div style={{visibility:ds3, position: ds31, top: ds32}}>
								{/* TABLE SECTION */}
								<section className="section pb-0 bg-gradient-warning">
									<Container>
										<h4 className="display-3 text-white"><center>Table Checker</center></h4>
										<div className="nav-wrapper">
											<Nav
												className="nav-fill flex-column flex-md-row"
												id="tabs-icons-text"
												pills
												role="tablist"
											>
												<NavItem>
													<NavLink
														aria-selected={this.state.tabs === 1}
														className={classnames("mb-sm-3 mb-md-0", {
															active: this.state.tabs === 1
														})}
														onClick={e => this.toggleNavs(e, "tabs", 1)}
														href="#pablo"
														role="tab"
													>
														<i className="ni ni-check-bold mr-2" />
														Confirmed Cases
													</NavLink>
												</NavItem>
												<NavItem>
													<NavLink
														aria-selected={this.state.tabs === 2}
														className={classnames("mb-sm-3 mb-md-0", {
															active: this.state.tabs === 2
														})}
														onClick={e => this.toggleNavs(e, "tabs", 2)}
														href="#pablo"
														role="tab"
													>
														<i className="ni ni-collection mr-2" />
														Close Contacts
													</NavLink>
												</NavItem>
												<NavItem>
													<NavLink
														aria-selected={this.state.tabs === 3}
														className={classnames("mb-sm-3 mb-md-0", {
															active: this.state.tabs === 3
														})}
														onClick={e => this.toggleNavs(e, "tabs", 3)}
														href="#pablo"
														role="tab"
													>
														<i className="ni ni-world mr-2" />
														Public At The Place
													</NavLink>
												</NavItem>
											</Nav>
										</div>
										<Card className="shadow">
											<CardBody>
												<TabContent activeTab={"tabs" + this.state.tabs}>
													<TabPane tabId="tabs1">
														<div style={{ textAlign: "left", height: "100%" }}>
															<h5>
																{/* <Chip label="Basic" /> */}
																{/* PlaceName */}
																<Badge color="primary">
																	{this.state.placename}
																</Badge>
																{' '}
																{/* Time Span */}
																<Badge color="primary">
																	{this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")}
																</Badge>
															</h5>
															<Table tableprops={mappingsCC} display={displaySetting2} type="CC" databack={this.databackTable} />
														</div>
													</TabPane>
													<TabPane tabId="tabs2">
														<div style={{ textAlign: "left", height: "100%" }}>
															<h5>
																{/* PlaceName */}
																<Badge color="primary">
																	{this.state.placename}
																</Badge>
																{' '}
																{/* Time Span */}
																<Badge color="primary">
																	{this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")}
																</Badge>
															</h5>
															<Table tableprops={mappingsclose} display={displaySetting2} type="PATP" databack={this.databackTable} />
															<br/>
															<Button color="primary" type="button" onClick={() => this.setState({ showSelection: true })}>
																Manual Import
															</Button>
														</div>
													</TabPane>
													<TabPane tabId="tabs3">
														<div style={{ textAlign: "left", height: "100%" }}>
															<h5>
																{/* PlaceName */}
																<Badge color="primary">
																	{this.state.placename}
																</Badge>
																{' '}
																{/* Time Span */}
																<Badge color="primary">
																	{this.convertSQLDate(this.state.datetime[0], this.state.datetime[1], "header")}
																</Badge>
															</h5>
															<Table tableprops={mappingsPATP} display={displaySetting2} type="PATP" databack={this.databackTable} />
														</div>
													</TabPane>
												</TabContent>
											</CardBody>
										</Card>
									</Container>
									{/* SVG separator */}
									<div className="separator separator-bottom separator-skew zindex-100">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											preserveAspectRatio="none"
											version="1.1"
											viewBox="0 0 2560 100"
											x="0"
											y="0"
										>
											<polygon
												className="fill-white"
												points="2560 0 2560 100 0 100"
											/>
										</svg>
									</div>
								</section>
								
								{/* TRANSFER SECTION */}
								<div>
									<rb.Modal show={this.state.showSelection} onHide={()=>this.setState({showSelection:false})} centered size="xl" scrollable={true}>
										<rb.Modal.Header closeButton>
											<rb.Modal.Title>Transfer Users</rb.Modal.Title>
										</rb.Modal.Header>
										<rb.Modal.Body>
											<div style={{float:"left", textAlign:"center", width:"40%"}}>
												<text fontSize="20px"><b>Close Contact With Public</b></text>
												<div style={{backgroundColor:"#F9F9F9", }}>
													<Table2 tableprops={mappingsclose} display={displaySetting2} type="modal-edit" callbackFromParent={this.myCallback2} databack={this.databackTable}/>
												</div>
											</div>
											<div style={{float:"left", textAlign:"center", width:"20%", alignItems:"center", justifyContent:"center"}}>
												<rb.Button onClick={this.toCCClicked}> &lt; &lt; </rb.Button>
												<br/>
												<rb.Button onClick={this.fromCCClicked}> &gt; &gt; </rb.Button>
											</div>
											<div style={{float:"right", textAlign:"center", width:"40%"}}>
												<text fontSize="20px"><b>Public At The Place</b></text>
												<div style={{backgroundColor:"#F9F9F9"}}>
													<Table tableprops={mappingsPATP} display={displaySetting2} type="modal-edit" callbackFromParent={this.myCallback} databack={this.databackTable}/>
												</div>
											</div>
										</rb.Modal.Body>
										<rb.Modal.Footer>
											<rb.Button variant="secondary" onClick={()=>this.setState({showSelection:false})}>
												Close
											</rb.Button>
										</rb.Modal.Footer>
									</rb.Modal>
								</div>

								{/* Profile Page */}
								<div>
									<rb.Modal show={this.state.showSelection2} onHide={()=>this.setState({showSelection2:false})} size="xl" centered scrollable={true}>
										<rb.Modal.Header closeButton>
											<rb.Modal.Title>Person Profile</rb.Modal.Title>
										</rb.Modal.Header>
										<rb.Modal.Body>
											<ProfileModal profile={this.state.profileModal}/>
										</rb.Modal.Body>
										<rb.Modal.Footer>
											<rb.Button variant="secondary" onClick={()=>this.setState({showSelection2:false})}>
												Close
											</rb.Button>
										</rb.Modal.Footer>
									</rb.Modal>
								</div>
							</div>
						
						</div>
					</div>

					{/* END SECTION */}
					<section className="section section-lg">
						<Footer/>
					</section>


				</main>
			</>
		);
	}
}

export default MainPage;