import React, { Component } from 'react';
import * as d3 from "d3";
import './UserGraph.css'

class UserGraph extends React.Component {
	constructor(props) {
		super(props);

    this.drawGraph = this.drawGraph.bind(this);
    this.dragStarted = this.dragStarted.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragEnded = this.dragEnded.bind(this);
	}

  // tick() {
  //   path.attr("d", function(d) {
  //       var dx = d.target.x - d.source.x,
  //           dy = d.target.y - d.source.y,
  //           dr = Math.sqrt(dx * dx + dy * dy);
  //       return "M" +
  //           d.source.x + "," +
  //           d.source.y + "A" +
  //           dr + "," + dr + " 0 0,1 " +
  //           d.target.x + "," +
  //           d.target.y;
  //   });

  //   node
  //       .attr("transform", function(d) {
  //       return "translate(" + d.x + "," + d.y + ")"; })
  // }

	componentDidMount() {
		this.drawGraph();
	}

  componentDidUpdate() {
    this.drawGraph();
  }

	drawGraph() {
    const node = this.node;

    d3.select(node)
      .selectAll(".node")
      .data(this.props.users)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", this.dragStarted)
        .on("drag", this.dragged)
        .on("end", this.dragEnded)
      );

    let rScale = d3.scalePow()
                    .domain([0, 750])
                    .range([1, 10]);

    d3.select(node)
      .selectAll(".node")
      .append("circle")
      .attr("r", function(node) { return rScale(node.rank); })
      .attr("class", "unfixed");
	}

  dragStarted(d) {
    console.log(d);
  }

  dragged(d) {
    
  }

  dragEnded(d) {

  }

	render() {
		return	(
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height}>
      </svg>
    );
	}
}

export default UserGraph;