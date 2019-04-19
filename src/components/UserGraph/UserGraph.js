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
		this.drawGraph(this.props.users, this.props.links);
	}

  componentDidUpdate(prevProps, prevState) {
    this.drawGraph(this.props.users, this.props.links);
  }

	drawGraph(users, links) {
    const node = this.node;

    this.force = d3.forceSimulation()
      .nodes(d3.values(users))
      .force("link", d3.forceLink(links).id(function(d) {
        return d.name;
      }).distance(60))
      .force('center', d3.forceCenter(this.props.width / 2, this.props.height / 2))
      .force("x", d3.forceX(this.props.width / 2))
      .force("y", d3.forceY(this.props.height / 2))
      .force("charge", d3.forceManyBody().strength(-250))
      .alphaTarget(1)
      .on("tick", this.tick);

    // build the arrow.
    d3.select(node)
      .selectAll("marker")
      .data(["end"])      // Different link/path types can be defined here
      .enter().append("marker")    // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", -1.5)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("path")
      .attr("class", "marker-path")
      .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    d3.select(node)
      .append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("marker-end", "url(#end)");

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
    let rScale = d3.scaleLinear()
                    .domain([300, 850])
                    .range([25, 7]);

    let colorScale = d3.scaleThreshold()
        .domain(d3.range(300, 850, (850-300)/10))
        .range(d3.schemeRdYlGn[9]); 


    // add the nodes
    d3.select(node)
      .selectAll(".node")
      .append("circle")
      .attr("r", 15)
      .attr("class", function(node) {
        if (node.fixed || node.is_parent) {
          node.fixed = true;
          return "fixed";
        } else {
          return "unfixed";
        }
      })
      .attr("id", function(node) { return node.name; })
      .attr("fill", 'blue');
	}

  tick() {
    const node = this.node;

    d3.select(node)
      .selectAll(".node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    d3.select(node)
      .selectAll(".link")
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
      if (d.fixed === true) {
        this.props.loadUser(d.name, true);
      }
    }

    let node = this.node;

    if (d.fixed === true){
      d.fx = d.x;
      d.fy = d.y;
      d3.select(node).select('[id="' + d.name + '"]').attr("class", "fixed");
    }
    else{
      d.fx = null;
      d.fy = null;
      d3.select(node).select('[id="' + d.name + '"]').attr("class", "unfixed");
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