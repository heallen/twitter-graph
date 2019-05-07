import React from 'react';

class Input extends React.Component {
  onSubmit = () => {
    const list = document.querySelector('#input').value.split('\n');
    this.props.renderGraph(list);
  }

  render() {
      return <div>
        <h1>Twitter Influence Analysis</h1>
        Enter a list of twitter handles, each on a new line <br /> <br />
        <textarea id='input' style={{'width': '500px', 'height': '400px' }}></textarea> <br />
        <button onClick={this.onSubmit}>Create Influence Graph</button> <br />
        <button onClick={this.props.renderPennGraph}>View Penn Graph</button>
      </div>
  }
}

export default Input;
