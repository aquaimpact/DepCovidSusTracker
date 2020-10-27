import React from 'react'

// reactstrap components
import {
	Container,
	Row,
	Col,
	UncontrolledTooltip
} from "reactstrap";

class Footer extends React.Component{
    render(){
        return(
            <>
                <Container>
                    <Row className="row-grid justify-content-center">
                    <Col className="text-center" lg="8">
                        <h2 className="display-3">
                        Thank You For Using This Simple Tool{" "}
                        <span className="text-success">
                            Designed for Viewing Covid-19 Suspects
                        </span>
                        </h2>
                        <p className="lead">
                        This project was done as part of my internship with CSIT
                        that started on 6 July and ended on 20 November
                        </p>

                        
                        <a href="https://www.tp.edu.sg/" target="_blank">
                            <img src={require("../../../Imgs/tplogo-course-search.png")} style={{width:"50%"}}/>
                        </a>
                        <a href="https://www.csit.gov.sg/" target="_blank">
                            <img src={require("../../../Imgs/csit-logo.png")}/>
                        </a>

                        <div className="btn-wrapper">
                        {/* <Button
                            className="mb-3 mb-sm-0"
                            color="primary"
                            href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                        >
                            Download React
                        </Button> */}
                        </div>
                        <div className="text-center">
                        <h4 className="display-4 mb-5 mt-5">
                            Here are some links to contact me
                        </h4>
                        <Row className="justify-content-center">
                            <Col lg="2" xs="4">
                            <a
                                href="https://github.com/aquaimpact"
                                id="tooltip255035741"
                                target="_blank"
                            >
                                <img
                                alt="..."
                                className="img-fluid"
                                src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                                />
                            </a>
                            <UncontrolledTooltip delay={0} target="tooltip255035741">
                                Github
                            </UncontrolledTooltip>
                            </Col>
                        </Row>
                        </div>
                    </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default Footer