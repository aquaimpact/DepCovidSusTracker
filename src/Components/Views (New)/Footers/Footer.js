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
                            <Col lg="2" xs="4">
                            <a
                                href="https://www.creative-tim.com/product/vue-argon-design-system?ref=adsr-landing-page"
                                id="tooltip265846671"
                                target="_blank"
                            >
                                <img
                                alt="..."
                                className="img-fluid"
                                src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/vue.jpg"
                                />
                            </a>
                            <UncontrolledTooltip delay={0} target="tooltip265846671">
                                Vue.js - The progressive javascript framework
                            </UncontrolledTooltip>
                            </Col>
                            <Col lg="2" xs="4">
                            <a
                                href="https://www.creative-tim.com/product/argon-design-system-angular?ref=adsr-landing-page"
                                id="tooltip233150499"
                                target="_blank"
                            >
                                <img
                                alt="..."
                                className="img-fluid"
                                src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/angular.jpg"
                                />
                            </a>
                            <UncontrolledTooltip delay={0} target="tooltip233150499">
                                Angular - One framework. Mobile & Desktop
                            </UncontrolledTooltip>
                            </Col>
                            <Col lg="2" xs="4">
                            <a
                                href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                                id="tooltip308866163"
                                target="_blank"
                            >
                                <img
                                alt="..."
                                className="img-fluid"
                                src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/react.jpg"
                                />
                            </a>
                            <UncontrolledTooltip delay={0} target="tooltip308866163">
                                React - A JavaScript library for building user
                                interfaces
                            </UncontrolledTooltip>
                            </Col>
                            <Col lg="2" xs="4">
                            <a
                                href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                                id="tooltip76119384"
                                target="_blank"
                            >
                                <img
                                alt="..."
                                className="img-fluid"
                                src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/sketch.jpg"
                                />
                            </a>
                            <UncontrolledTooltip delay={0} target="tooltip76119384">
                                Sketch - Digital design toolkit
                            </UncontrolledTooltip>
                            </Col>
                            <Col lg="2" xs="4">
                            <a
                                href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                                id="tooltip646643508"
                                target="_blank"
                            >
                                <img
                                alt="..."
                                className="img-fluid"
                                src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/ps.jpg"
                                />
                            </a>
                            <UncontrolledTooltip delay={0} target="tooltip646643508">
                                Adobe Photoshop - Software for digital images
                                manipulation
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