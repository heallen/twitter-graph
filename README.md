# twitter-graph

## Setup

### Setting up the repository

1. Clone the repository `git clone https://github.com/heallen/twitter-graph`.
2. Install required modules with `npm install`.
3. Start the app with `npm start` and navigate to localhost:3000.

### Selenium

By default, this app allows you to view a graph containing a subset of twitter users relevant to
Penn. If you would like to induce your own subgraph using an initial set of twitter handles,
follow the instructions below.

1. Download the Selenium chrome driver from [here](http://chromedriver.storage.googleapis.com/index.html)
   corresponding to the version of chrome on your system (find by typing `chrome://version/` in
   your browser).
2. Place the executable somewhere e.g. home directory.
3. Add the directory containing the executable to your system path (e.g. for Mac, update your
   `.bash_profile` file with `export PATH=$PATH:~`).
4. Modify the `config.json` file in the root directory to contain valid twitter login information.
5. Run `node server.js` to start the server.
6. Run `npm start` in a separate terminal to start the app.

### Usage

To view the default Penn graph, click the View Penn Graph button. Otherwise, provide a newline-separated
list of twitter handles (without the @ prefix) and click Create Influence Graph. Note that as the program
scrapes twitter, the browser should stay in focus. Also note that parsing many users may take some time.

As a small example, try inputting the handles `robertghrist`, `fancytypes`, `swapneel`, and `zgives`.