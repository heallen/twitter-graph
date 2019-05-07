import React from 'react';
import './App.css';
import Input from './Input.js';
import VizGraph from './Graph.js';
import pennGraph from './pennGraph.json';
import { pageRank } from './functions.js';

function buildGraph(graph, pageRanks) {
  const nodes = [];
  const links = [];
  for (const node in graph) {
    nodes.push({ id: node, size: 6000 * pageRanks[node] });
    for (const neighbor of graph[node]) {
      links.push({ source: node, target: neighbor });
    }
  }
  return {
    nodes,
    links,
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      graph: {},
    }
  }

  renderGraph = (handleList) => {
    // send request
    fetch('http://localhost:3001/', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({handleList: handleList}),
    }).then(response => response.json())
    .then(({ graph }) => {
      // transform response accordingly to graph data
      const pageRanks = pageRank(graph);
      const graphData = buildGraph(graph, pageRanks);
      this.setState({
        graph: graph,
        data: graphData,
      });
    })
  }

  renderPennGraph = () => {
    const pageRanks = pageRank(pennGraph);
    const graphData = buildGraph(pennGraph, pageRanks);
    this.setState({
      graph: pennGraph,
      data: graphData,
    });
  }

  closeGraph = () => {
    this.setState({
      graph: {},
      data: {},
    })
  }

  render() {
      if (this.state.data.nodes) {
        return <div className='App'>
          <VizGraph data={this.state.data} graph={this.state.graph} closeGraph={this.closeGraph}/>
        </div>;
      } else {
        return <div className='App'>
          <Input renderPennGraph={this.renderPennGraph} renderGraph={this.renderGraph} />
        </div>;
      }
  }
}

export default App;
