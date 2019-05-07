import React from 'react';
import { Graph } from 'react-d3-graph';
import './App.css';
import { shortestPath } from './functions.js';

class VizGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      source: null,
      target: null,
      shortestPath: [],
    }
  }

  getShortestPath = () => {
    const source = document.querySelector('#source').value;
    const target = document.querySelector('#target').value;
    if (!source in this.props.graph || !source in this.props.graph) {
      this.setState({
        shortestPath: ['No path'],
      })
      return;
    }
    const path = shortestPath(this.props.graph, source, target);
    if (!path) {
      this.setState({
        shortestPath: ['No path'],
      })
      return;
    }
    this.setState({
      source: source,
      target: target,
      shortestPath: path,
    });
  }

  render() {
  // the graph configuration
  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: 'lightgreen',
        size: 500,
        fontSize: 16,
        highlightFontSize: 16,
        highlightStrokeColor: 'blue',
    },
    link: {
        highlightColor: 'lightblue'
    },
    d3: {
      gravity: -500,
      linkStrength: 0.01,
    },
    directed: true,
    height: 500,
    width: 1000,
  };

    return (
      <div>
        <h1>Graph Visualization</h1>
        <button onClick={this.props.closeGraph}>Close Graph</button> <br /><br />
        <div className='graph-container'>
          <Graph
            id="graph-id"
            data={this.state.data || { nodes: [], links: [] }}
            config={myConfig}
          />
        </div>
        <br />
        <div>
          Source: <input type='text' id='source' /> <br/>
          Target: <input type='text' id='target' /> <br/>
          <button id='find' onClick={this.getShortestPath}>Find Shortest Path</button>
        </div>
        {
          this.state.shortestPath
          && <div>
            {this.state.shortestPath.join('->')}
          </div>
        }
      </div>
    );
  }
}

export default VizGraph;
