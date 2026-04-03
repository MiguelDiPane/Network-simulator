/**
 * Watts-Strogatz Small-World Network Algorithm
 */

export interface Node {
  id: string;
  degree?: number;
  localClustering?: number;
}

export interface Edge {
  source: string;
  target: string;
}

export interface NetworkData {
  nodes: Node[];
  edges: Edge[];
  currentStep?: {
    type: 'init' | 'rewire';
    nodeIdx: number;
    neighborIdx: number;
    description: string;
    oldTarget?: string;
    newTarget?: string;
  };
}

function getMetrics(n: number, edges: Edge[]) {
  const adjList: Map<string, Set<string>> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i.toString(), new Set());
  
  for (const edge of edges) {
    adjList.get(edge.source)?.add(edge.target);
    adjList.get(edge.target)?.add(edge.source);
  }

  const nodeMetrics: { degree: number; localClustering: number }[] = [];

  for (let i = 0; i < n; i++) {
    const id = i.toString();
    const neighbors = Array.from(adjList.get(id) || []);
    const ki = neighbors.length;
    let localC = 0;

    if (ki >= 2) {
      let ei = 0;
      for (let j = 0; j < ki; j++) {
        for (let l = j + 1; l < ki; l++) {
          if (adjList.get(neighbors[j])?.has(neighbors[l])) {
            ei++;
          }
        }
      }
      localC = (2 * ei) / (ki * (ki - 1));
    }

    nodeMetrics.push({ degree: ki, localClustering: localC });
  }

  return nodeMetrics;
}

export function* generateWattsStrogatzStepByStep(n: number, k: number, beta: number): Generator<NetworkData> {
  let nodes: Node[] = Array.from({ length: n }, (_, i) => ({ id: i.toString() }));
  const edges: Edge[] = [];
  const adj = new Set<string>();

  const addEdge = (u: number, v: number) => {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    if (!adj.has(key)) {
      adj.add(key);
      edges.push({ source: u.toString(), target: v.toString() });
    }
  };

  // 1. Initialize regular ring lattice
  const halfK = Math.floor(k / 2);
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= halfK; j++) {
      const neighbor = (i + j) % n;
      addEdge(i, neighbor);
    }
  }

  const initialMetrics = getMetrics(n, edges);
  nodes = nodes.map((node, i) => ({ ...node, ...initialMetrics[i] }));

  yield { nodes, edges, currentStep: { type: 'init', nodeIdx: -1, neighborIdx: -1, description: 'Initialized regular ring lattice' } };

  // 2. Rewire edges
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= halfK; j++) {
      if (Math.random() < beta) {
        const neighbor = (i + j) % n;
        const oldKey = i < neighbor ? `${i}-${neighbor}` : `${neighbor}-${i}`;

        let newTarget: number;
        let attempts = 0;
        const maxAttempts = n * 2;
        
        do {
          newTarget = Math.floor(Math.random() * n);
          attempts++;
        } while (
          (newTarget === i || adj.has(i < newTarget ? `${i}-${newTarget}` : `${newTarget}-${i}`)) &&
          attempts < maxAttempts
        );

        if (attempts < maxAttempts) {
          // Remove old edge
          adj.delete(oldKey);
          const edgeIdx = edges.findIndex(e => 
            (e.source === i.toString() && e.target === neighbor.toString()) ||
            (e.source === neighbor.toString() && e.target === i.toString())
          );
          if (edgeIdx !== -1) edges.splice(edgeIdx, 1);

          // Add new edge
          addEdge(i, newTarget);
          
          const stepMetrics = getMetrics(n, edges);
          const stepNodes = nodes.map((node, idx) => ({ ...node, ...stepMetrics[idx] }));

          yield { 
            nodes: stepNodes, 
            edges: [...edges], 
            currentStep: { 
              type: 'rewire', 
              nodeIdx: i, 
              neighborIdx: j, 
              description: `Rewired edge from node ${i} to ${newTarget}`,
              oldTarget: neighbor.toString(),
              newTarget: newTarget.toString()
            } 
          };
        }
      }
    }
  }

  const finalMetrics = getMetrics(n, edges);
  nodes = nodes.map((node, i) => ({ ...node, ...finalMetrics[i] }));
  yield { nodes, edges, currentStep: { type: 'rewire', nodeIdx: n, neighborIdx: halfK, description: 'Simulation complete' } };
}

export function calculateClusteringCoefficient(n: number, edges: Edge[]): number {
  const adjList: Map<string, Set<string>> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i.toString(), new Set());
  
  for (const edge of edges) {
    adjList.get(edge.source)?.add(edge.target);
    adjList.get(edge.target)?.add(edge.source);
  }

  let totalC = 0;
  for (let i = 0; i < n; i++) {
    const id = i.toString();
    const neighbors = Array.from(adjList.get(id) || []);
    const ki = neighbors.length;
    if (ki < 2) continue;

    let ei = 0;
    for (let j = 0; j < ki; j++) {
      for (let l = j + 1; l < ki; l++) {
        if (adjList.get(neighbors[j])?.has(neighbors[l])) {
          ei++;
        }
      }
    }
    totalC += (2 * ei) / (ki * (ki - 1));
  }

  return totalC / n;
}

export function calculateAveragePathLength(n: number, edges: Edge[]): number {
  const adjList: Map<string, Set<string>> = new Map();
  for (let i = 0; i < n; i++) adjList.set(i.toString(), new Set());
  
  for (const edge of edges) {
    adjList.get(edge.source)?.add(edge.target);
    adjList.get(edge.target)?.add(edge.source);
  }

  let totalDist = 0;
  let pairs = 0;

  for (let startNode = 0; startNode < n; startNode++) {
    const distances: Map<string, number> = new Map();
    const queue: string[] = [startNode.toString()];
    distances.set(startNode.toString(), 0);

    while (queue.length > 0) {
      const u = queue.shift()!;
      const d = distances.get(u)!;

      for (const v of adjList.get(u) || []) {
        if (!distances.has(v)) {
          distances.set(v, d + 1);
          queue.push(v);
          totalDist += d + 1;
          pairs++;
        }
      }
    }
  }

  return pairs === 0 ? 0 : totalDist / pairs;
}
