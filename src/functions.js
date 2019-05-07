let Dequeue = require('dequeue');

// returns sequence of nodes on shortest path from u to v in the given graph
export function shortestPath(graph, u, v) {
  if (u == v) { return [u]; }
  let parents = {};
  let discovered = new Set();
  let queue = new Dequeue();
  discovered.add(u);
  queue.push(u);
  while (queue.length > 0 && !(v in parents)) {
    let size = queue.length;
    for (let i = 0; i < size && !(v in parents); ++i) {
      let a = queue.shift();
      for (let b of graph[a]) {
        if (!discovered.has(b)) {
          parents[b] = a;
          discovered.add(b);
          queue.push(b);
          if (b == v) { break; }
        }
      }
    }
  }
  if (!(v in parents)) { return null; }
  let result = []
  let curr = v;
  while (curr in parents && curr != u) {
    result.push(curr);
    curr = parents[curr];
  }
  result.push(u);
  result.reverse();
  return result;
}

// shortest path test
let graph = {
  'one': ['two', 'three'],
  'two': [],
  'three': ['two', 'four'],
  'four': ['three', 'two']
}

// given (N x 1) vector, returns L2 norm
function vl2norm(v) {
  let sum = 0;
  for (let v_i of v) {
    sum += v_i[0] * v_i[0];
  }
  return Math.sqrt(sum);
}

// test vl2norm
let v = [[2], [7], [1], [3]];

// given two (N x 1) vectors, subtracts second from first
function vsubtract(v1, v2) {
  let ans = []
  for (let i in v1) {
    ans.push([v1[i] - v2[i]]);
  }
  return ans;
}

// assumes matrices are correct dimensions
function matmul(M1, M2) {
  let m = M1.length
  let n = M2.length
  let p = M2[0].length
  let res = Array(m).fill(0).map(() => Array(p).fill(0));
  for (let i in M1) {
    for (let j in M2[i]) {
      let sum = 0;
      for (let k = 0; k < n; ++k) {
        sum += M1[i][k] * M2[k][j];
      }
      res[i][j] = sum;
    }
  }
  return res;
}

// returns copy of matrix
function copyM(M) {
  let m = M.length;
  let n = M[0].length;
  let res = Array(m).fill(0).map(() => Array(n).fill(0));
  for (let i in M) {
    for (let j in M[i]) {
      res[i][j] = M[i][j];
    }
  }
  return res;
}

// given adjacency list, returns PR transition matrix
// M[i][j] represents link from j to i
// if no outgoing edges, we automatically add outgoing edges to all other nodes
function transitionMatrix(graph) {
  let name2id = {};
  let id2name = [];
  let names = new Set();
  for (let name in graph) {
    if (!names.has(name)) {
      names.add(name);
      id2name.push(name);
      name2id[name] = id2name.length - 1;
    }
  }
  let N = id2name.length;
  let M = Array(N).fill(0).map(() => Array(N).fill(0));
  for (let name in graph) {
    if (graph[name].length > 0) {
      let value = 1 / graph[name].length;
      for (let neighbor of graph[name]) {
        M[name2id[neighbor]][name2id[name]] = value;
      }
    } else {
      let value = 1 / (N - 1);
      for (let neighbor in graph) {
        if (neighbor != name) {
          M[name2id[neighbor]][name2id[name]] = value;
        }
      }
    }
  }
  return [M, id2name];
}

// M is 2d array; code adapted from python code on wikipedia
// no damping
export function pageRank(graph, eps = 0.0000001) {
  let temp = transitionMatrix(graph);
  let M = temp[0];
  let id2name = temp[1];
  let N = M[0].length;
  let v = Array(N).fill([1 / N]);
  let last_v = Array(N).fill([100])
  while (vl2norm(vsubtract(v, last_v)) > eps) {
    last_v = copyM(v);
    v = matmul(M, v);
  }
  let ans = {};
  for (let i in v) {
    ans[id2name[i]] = v[i];
  }
  return ans;
}

function indegrees(graph) {
  let indegs = {};
  for (const node in graph) {
    indegs[node] = graph[node].length
  }
  return indegs;
}