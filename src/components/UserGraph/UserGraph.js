import React, { Component } from 'react';
import * as d3 from "d3";
import './UserGraph.css'

class UserGraph extends React.Component {
	constructor(props) {
		super(props);

    this.firstClick = new Date();

    this.drawGraph = this.drawGraph.bind(this);
    this.dragStarted = this.dragStarted.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragEnded = this.dragEnded.bind(this);
    this.tick = this.tick.bind(this);
	}

	componentDidMount() {
		this.drawGraph();
	}

  componentDidUpdate() {
    this.drawGraph();
  }

	drawGraph() {
    const node = this.node;
    this.force = d3.forceSimulation()
      .nodes(d3.values(this.props.users))
      .force("link", d3.forceLink(this.props.links).id(function(d) {
        return d.name;
      }).distance(60))
      .force('center', d3.forceCenter(this.props.width / 2, this.props.height / 2))
      .force("x", d3.forceX(this.props.width / 2))
      .force("y", d3.forceY(this.props.height / 2))
      .force("charge", d3.forceManyBody().strength(-250))
      .alphaTarget(1)
      .on("tick", this.tick);

    // add the links and the arrows
    d3.select(node)
      .append("g")
      .selectAll("path")
      .data(this.props.links)
      .enter()
      .append("path")
      .attr("class", "link");

    // define the nodes
    d3.select(node)
      .selectAll(".node")
      .data(this.force.nodes())
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", this.dragStarted)
        .on("drag", this.dragged)
        .on("end", this.dragEnded)
      );

    // radius scale
    let rScale = d3.scalePow()
                    .domain([0, 750])
                    .range([1, 10]);

    // add the nodes
    d3.select(node)
      .selectAll(".node")
      .append("circle")
      .attr("r", function(node) { return rScale(node.rank); })
      .attr("class", "unfixed");
	}

  tick() {
    const node = this.node;
    
    d3.select(node)
      .selectAll("path")
      .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
      });

    d3.select(node)
      .selectAll(".node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
  }

  dragStarted(d) {
    if (!d3.event.active)
      this.force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragEnded(d) {
    if (!d3.event.active)
      this.force.alphaTarget(0);

    // Calculate time between prev two clicks
    let currClick = new Date();
    let clickDurationMs = currClick.getTime() - this.firstClick.getTime();

    // Keep track of this click for next time
    this.firstClick = new Date();

    if (clickDurationMs < 400) {
      d.fixed = !d.fixed;
    }
    console.log(d);
    if (d.fixed === true){
       d.fx = d.x;
       d.fy = d.y;
       d3.select(this.node.childNodes[0]).attr("class", "fixed");
    }
    else{
      d.fx = null;
      d.fy = null;
      d3.select(this.node.childNodes[0]).attr("class", "unfixed");
    }
  }

	render() {
		return	(
      <svg ref={node => this.node = node} width={this.props.width} height={this.props.height}>
      </svg>
    );
	}
}

export default UserGraph;