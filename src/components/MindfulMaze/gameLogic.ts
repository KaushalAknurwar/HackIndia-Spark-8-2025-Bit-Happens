export const MAZE_SIZE = 10;

export interface Position {
  x: number;
  y: number;
}

export interface Collectible {
  x: number;
  y: number;
  type: 'star' | 'crystal' | 'heart';
  collected: boolean;
}

const hasValidPath = (maze: number[][]): boolean => {
  const visited = Array(MAZE_SIZE).fill(false).map(() => Array(MAZE_SIZE).fill(false));
  return findPath(maze, 0, 0, visited);
};

const findPath = (maze: number[][], x: number, y: number, visited: boolean[][]): boolean => {
  // Check if position is valid
  if (x < 0 || x >= MAZE_SIZE || y < 0 || y >= MAZE_SIZE || 
      maze[y][x] === 1 || visited[y][x]) {
    return false;
  }

  // Mark current cell as visited
  visited[y][x] = true;

  // Check if we reached the end
  if (x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1) {
    return true;
  }

  // Try all possible directions
  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0]  // up
  ];

  for (const [dx, dy] of directions) {
    if (findPath(maze, x + dx, y + dy, visited)) {
      return true;
    }
  }

  return false;
};

const optimizePath = (maze: number[][]): void => {
  // Create paths around collectibles to ensure they're reachable
  for (let y = 0; y < MAZE_SIZE; y++) {
    for (let x = 0; x < MAZE_SIZE; x++) {
      // Don't create too many consecutive walls
      if (x > 1 && y > 1 && 
          maze[y][x] === 1 && 
          maze[y][x-1] === 1 && 
          maze[y-1][x] === 1) {
        maze[y][x] = 0; // Create a path
      }
    }
  }
};

const ensureMinimumPathWidth = (maze: number[][]): void => {
  for (let y = 1; y < MAZE_SIZE - 1; y++) {
    for (let x = 1; x < MAZE_SIZE - 1; x++) {
      // If current cell is a path
      if (maze[y][x] === 0) {
        // Ensure at least one adjacent cell is also a path
        let allWalls = true;
        const adjacentCells = [
          [y-1, x], [y+1, x], [y, x-1], [y, x+1]
        ];
        
        for (const [ny, nx] of adjacentCells) {
          if (maze[ny][nx] === 0) {
            allWalls = false;
            break;
          }
        }
        
        if (allWalls) {
          // Create at least one path
          const randomDirection = Math.floor(Math.random() * 4);
          const [ny, nx] = adjacentCells[randomDirection];
          maze[ny][nx] = 0;
        }
      }
    }
  }
};

export const generateMaze = (difficulty: 'easy' | 'medium' | 'hard'): number[][] => {
  const wallDensity = {
    easy: 0.25,
    medium: 0.35,
    hard: 0.45
  }[difficulty];

  let newMaze: number[][];
  let attempts = 0;
  const maxAttempts = 100;

  do {
    newMaze = Array(MAZE_SIZE).fill(0).map(() =>
      Array(MAZE_SIZE).fill(0).map(() => Math.random() > wallDensity ? 0 : 1)
    );
    
    // Clear start area (2x2)
    newMaze[0][0] = 0;
    newMaze[0][1] = 0;
    newMaze[1][0] = 0;
    newMaze[1][1] = 0;
    
    // Clear end area (2x2)
    newMaze[MAZE_SIZE-1][MAZE_SIZE-1] = 0;
    newMaze[MAZE_SIZE-2][MAZE_SIZE-1] = 0;
    newMaze[MAZE_SIZE-1][MAZE_SIZE-2] = 0;
    newMaze[MAZE_SIZE-2][MAZE_SIZE-2] = 0;

    // Apply both path optimizations
    optimizePath(newMaze);
    ensureMinimumPathWidth(newMaze);
    
    attempts++;
    if (attempts === maxAttempts) {
      return generateMaze('easy');
    }
  } while (!hasValidPath(newMaze));
  
  return newMaze;
};

export const generateCollectibles = (maze: number[][]): Collectible[] => {
  if (!maze || maze.length === 0) return [];
  
  const items: Collectible[] = [];
  const types: ('star' | 'crystal' | 'heart')[] = ['star', 'crystal', 'heart'];
  
  // Divide maze into regions for better collectible distribution
  const regions = [
    { minX: 2, maxX: MAZE_SIZE/2-1, minY: 2, maxY: MAZE_SIZE/2-1 },
    { minX: MAZE_SIZE/2, maxX: MAZE_SIZE-3, minY: 2, maxY: MAZE_SIZE/2-1 },
    { minX: 2, maxX: MAZE_SIZE/2-1, minY: MAZE_SIZE/2, maxY: MAZE_SIZE-3 },
    { minX: MAZE_SIZE/2, maxX: MAZE_SIZE-3, minY: MAZE_SIZE/2, maxY: MAZE_SIZE-3 }
  ];

  // Try to place one collectible in each region
  regions.forEach(region => {
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const x = Math.floor(Math.random() * (region.maxX - region.minX + 1)) + region.minX;
      const y = Math.floor(Math.random() * (region.maxY - region.minY + 1)) + region.minY;

      if (maze[y][x] === 0 && !items.some(item => item.x === x && item.y === y)) {
        items.push({
          x,
          y,
          type: types[Math.floor(Math.random() * types.length)],
          collected: false
        });
        break;
      }
      attempts++;
    }
  });

  return items;
};

export const calculatePoints = (collectibleType: 'star' | 'crystal' | 'heart'): number => {
  const points = {
    star: 10,
    crystal: 15,
    heart: 20
  };
  return points[collectibleType];
};