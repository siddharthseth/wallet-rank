import React, { Component } from 'react';
import * as d3 from "d3";

class UserGraph extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.drawGraph();
	}

	drawGraph() {
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", this.props.width)
                  .attr("height", this.props.height);
	}

	render() {
		return	<div id={"#" + this.props.id}></div>
	}
}

export default UserGraph;