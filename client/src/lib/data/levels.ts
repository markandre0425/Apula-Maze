import { GameLevel } from "../stores/useFireSafetyGame";

export const levels: GameLevel[] = [
  {
    id: 1,
    name: "Home Evacuation",
    description: "Navigate through a smoke-filled home to find the exit.",
    mapWidth: 20,
    mapHeight: 15,
    startPosition: { x: 2, y: 2 },
    exitPosition: { x: 18, y: 13 },
    timeLimit: 120, // seconds
    hazards: [
      { id: "fire1", x: 5, y: 7, size: 1, extinguished: false },
      { id: "fire2", x: 10, y: 5, size: 1.5, extinguished: false },
      { id: "fire3", x: 8, y: 12, size: 1, extinguished: false },
      { id: "fire4", x: 14, y: 8, size: 2, extinguished: false },
      { id: "fire5", x: 13, y: 2, size: 1, extinguished: false },
      { id: "fire6", x: 3, y: 13, size: 1.5, extinguished: false },
    ],
    collectibles: [
      { id: "ext1", x: 4, y: 4, type: "extinguisher", collected: false },
      { id: "ext2", x: 12, y: 10, type: "extinguisher", collected: false },
      { id: "mask1", x: 7, y: 3, type: "mask", collected: false },
      { id: "mask2", x: 17, y: 9, type: "mask", collected: false },
      { id: "tip1", x: 3, y: 9, type: "tip", collected: false, tipId: 1 },
      { id: "tip2", x: 15, y: 6, type: "tip", collected: false, tipId: 2 },
    ],
    obstacles: [
      // Outer walls
      { x: 0, y: 0, width: 20, height: 1 }, // Top wall
      { x: 0, y: 14, width: 20, height: 1 }, // Bottom wall
      { x: 0, y: 0, width: 1, height: 15 }, // Left wall
      { x: 19, y: 0, width: 1, height: 15 }, // Right wall
      
      // Maze-like interior walls with clear paths
      // Vertical walls
      { x: 5, y: 1, width: 1, height: 3 },  // Vertical wall 1 (shortened)
      { x: 5, y: 8, width: 1, height: 4 },  // Vertical wall 2 (shortened)
      { x: 10, y: 5, width: 1, height: 4 }, // Middle vertical wall (shortened and moved)
      { x: 15, y: 1, width: 1, height: 3 }, // Right vertical wall 1 (shortened)
      { x: 15, y: 8, width: 1, height: 3 }, // Right vertical wall 2 (shortened)
      
      // Horizontal interior walls (with gaps for player passage)
      { x: 1, y: 5, width: 3, height: 1 },  // Top left horizontal (shortened)
      { x: 6, y: 3, width: 3, height: 1 },  // Top middle horizontal (shortened)
      { x: 12, y: 5, width: 3, height: 1 }, // Top right horizontal (adjusted)
      { x: 1, y: 10, width: 3, height: 1 }, // Bottom left horizontal (shortened)
      { x: 6, y: 8, width: 3, height: 1 },  // Bottom middle horizontal (shortened)
      { x: 11, y: 10, width: 3, height: 1 },// Bottom right horizontal (shortened)
      { x: 16, y: 10, width: 3, height: 1 },// Bottom far right horizontal (with gap)
      
      // Smaller obstacles as decoration
      { x: 7, y: 6, width: 1, height: 1 },  // Center obstacle (smaller)
      { x: 13, y: 7, width: 1, height: 1 }, // Right side obstacle (smaller)
      { x: 3, y: 7, width: 1, height: 1 },  // Left side obstacle (smaller)
      { x: 17, y: 3, width: 1, height: 1 }, // Top right obstacle (smaller)
    ],
    completed: false,
    unlocked: true,
  },
  {
    id: 2,
    name: "Kitchen Safety",
    description: "Navigate a complex kitchen layout and address multiple fire hazards.",
    mapWidth: 18,
    mapHeight: 18,
    startPosition: { x: 2, y: 2 },
    exitPosition: { x: 16, y: 16 },
    timeLimit: 100, // seconds
    hazards: [
      { id: "fire1", x: 5, y: 5, size: 1, extinguished: false },
      { id: "fire2", x: 8, y: 8, size: 1.5, extinguished: false },
      { id: "fire3", x: 11, y: 4, size: 1, extinguished: false },
      { id: "fire4", x: 14, y: 10, size: 1.2, extinguished: false },
      { id: "fire5", x: 4, y: 14, size: 1.3, extinguished: false },
      { id: "fire6", x: 9, y: 13, size: 1, extinguished: false },
    ],
    collectibles: [
      { id: "ext1", x: 3, y: 5, type: "extinguisher", collected: false },
      { id: "ext2", x: 15, y: 8, type: "extinguisher", collected: false },
      { id: "ext3", x: 7, y: 15, type: "extinguisher", collected: false },
      { id: "mask1", x: 12, y: 7, type: "mask", collected: false },
      { id: "mask2", x: 5, y: 11, type: "mask", collected: false },
      { id: "tip1", x: 7, y: 10, type: "tip", collected: false, tipId: 3 },
      { id: "tip2", x: 13, y: 3, type: "tip", collected: false, tipId: 4 },
    ],
    obstacles: [
      // Outer walls
      { x: 0, y: 0, width: 18, height: 1 }, // Top wall
      { x: 0, y: 17, width: 18, height: 1 }, // Bottom wall
      { x: 0, y: 0, width: 1, height: 18 }, // Left wall
      { x: 17, y: 0, width: 1, height: 18 }, // Right wall
      
      // Kitchen layout - counters and appliances in maze pattern
      // Main island in center
      { x: 7, y: 7, width: 4, height: 4 },
      
      // Kitchen counters along walls
      { x: 1, y: 4, width: 4, height: 1 },  // Left counter 1
      { x: 1, y: 8, width: 3, height: 1 },  // Left counter 2
      { x: 1, y: 12, width: 2, height: 1 }, // Left counter 3
      
      { x: 13, y: 2, width: 4, height: 1 }, // Right counter 1
      { x: 14, y: 6, width: 3, height: 1 }, // Right counter 2
      { x: 13, y: 15, width: 4, height: 1 },// Right counter 3
      
      { x: 5, y: 1, width: 1, height: 3 },  // Top divider 1
      { x: 10, y: 1, width: 1, height: 4 }, // Top divider 2

      // Passages and barriers
      { x: 4, y: 9, width: 1, height: 5 },  // Left passage
      { x: 12, y: 8, width: 1, height: 6 }, // Right passage
      { x: 6, y: 13, width: 5, height: 1 }, // Bottom passage
      { x: 8, y: 3, width: 1, height: 3 },  // Top passage
      
      // Corner dead-ends
      { x: 3, y: 16, width: 3, height: 1 },
      { x: 15, y: 12, width: 2, height: 1 },
    ],
    completed: false,
    unlocked: false,
  },
  {
    id: 3,
    name: "School Fire Drill",
    description: "Navigate through a complex school building with multiple classrooms and corridors.",
    mapWidth: 25,
    mapHeight: 20,
    startPosition: { x: 5, y: 5 },
    exitPosition: { x: 23, y: 18 },
    timeLimit: 150, // seconds
    hazards: [
      { id: "fire1", x: 8, y: 7, size: 1, extinguished: false },
      { id: "fire2", x: 12, y: 10, size: 1.5, extinguished: false },
      { id: "fire3", x: 15, y: 5, size: 1, extinguished: false },
      { id: "fire4", x: 18, y: 12, size: 2, extinguished: false },
      { id: "fire5", x: 10, y: 15, size: 1.5, extinguished: false },
      { id: "fire6", x: 20, y: 8, size: 1, extinguished: false },
      { id: "fire7", x: 4, y: 11, size: 1.2, extinguished: false },
    ],
    collectibles: [
      { id: "ext1", x: 7, y: 8, type: "extinguisher", collected: false },
      { id: "ext2", x: 16, y: 7, type: "extinguisher", collected: false },
      { id: "ext3", x: 9, y: 15, type: "extinguisher", collected: false },
      { id: "mask1", x: 13, y: 5, type: "mask", collected: false },
      { id: "mask2", x: 20, y: 13, type: "mask", collected: false },
      { id: "mask3", x: 4, y: 18, type: "mask", collected: false },
      { id: "tip1", x: 9, y: 18, type: "tip", collected: false, tipId: 5 },
      { id: "tip2", x: 17, y: 3, type: "tip", collected: false, tipId: 6 },
    ],
    obstacles: [
      // Outer walls of school
      { x: 0, y: 0, width: 25, height: 1 }, // Top wall
      { x: 0, y: 19, width: 25, height: 1 }, // Bottom wall
      { x: 0, y: 0, width: 1, height: 20 }, // Left wall
      { x: 24, y: 0, width: 1, height: 20 }, // Right wall
      
      // Main corridor - horizontal
      { x: 2, y: 9, width: 21, height: 1 }, // Upper corridor wall
      { x: 2, y: 12, width: 21, height: 1 }, // Lower corridor wall
      
      // Main corridor - vertical (intersects the horizontal)
      { x: 12, y: 1, width: 1, height: 8 }, // Upper vertical corridor
      { x: 12, y: 13, width: 1, height: 6 }, // Lower vertical corridor
      
      // Classrooms - Top section
      { x: 3, y: 3, width: 7, height: 1 }, // Top left classroom - top wall
      { x: 3, y: 7, width: 7, height: 1 }, // Top left classroom - bottom wall
      { x: 3, y: 3, width: 1, height: 4 }, // Top left classroom - left wall
      { x: 10, y: 3, width: 1, height: 5 }, // Top left classroom - right wall
      
      { x: 14, y: 3, width: 9, height: 1 }, // Top right classroom - top wall
      { x: 14, y: 7, width: 9, height: 1 }, // Top right classroom - bottom wall
      { x: 14, y: 3, width: 1, height: 4 }, // Top right classroom - left wall
      { x: 22, y: 3, width: 1, height: 5 }, // Top right classroom - right wall
      
      // Classrooms - Bottom section
      { x: 3, y: 14, width: 7, height: 1 }, // Bottom left classroom - top wall
      { x: 3, y: 18, width: 7, height: 1 }, // Bottom left classroom - bottom wall
      { x: 3, y: 14, width: 1, height: 4 }, // Bottom left classroom - left wall
      { x: 10, y: 14, width: 1, height: 5 }, // Bottom left classroom - right wall
      
      { x: 14, y: 14, width: 9, height: 1 }, // Bottom right classroom - top wall
      { x: 14, y: 18, width: 7, height: 1 }, // Bottom right classroom - bottom wall
      { x: 14, y: 14, width: 1, height: 4 }, // Bottom right classroom - left wall
      { x: 22, y: 14, width: 1, height: 4 }, // Bottom right classroom - right wall
      
      // Doorways and obstacles
      { x: 6, y: 9, width: 1, height: 3 }, // Door between corridors
      { x: 18, y: 9, width: 1, height: 3 }, // Door between corridors
      { x: 5, y: 14, width: 3, height: 1 }, // Obstacle in bottom left room
      { x: 17, y: 3, width: 3, height: 1 }, // Obstacle in top right room
    ],
    completed: false,
    unlocked: false,
  },
  {
    id: 4,
    name: "Office Building",
    description: "Navigate a multi-floor office building during an emergency evacuation.",
    mapWidth: 22,
    mapHeight: 22,
    startPosition: { x: 3, y: 3 },
    exitPosition: { x: 20, y: 20 },
    timeLimit: 180, // seconds
    hazards: [
      { id: "fire1", x: 6, y: 5, size: 1.5, extinguished: false },
      { id: "fire2", x: 10, y: 8, size: 1.8, extinguished: false },
      { id: "fire3", x: 16, y: 7, size: 1.2, extinguished: false },
      { id: "fire4", x: 8, y: 14, size: 1.7, extinguished: false },
      { id: "fire5", x: 14, y: 15, size: 1.5, extinguished: false },
      { id: "fire6", x: 18, y: 11, size: 1, extinguished: false },
      { id: "fire7", x: 5, y: 18, size: 1.3, extinguished: false },
      { id: "fire8", x: 12, y: 19, size: 1.4, extinguished: false },
    ],
    collectibles: [
      { id: "ext1", x: 4, y: 7, type: "extinguisher", collected: false },
      { id: "ext2", x: 13, y: 6, type: "extinguisher", collected: false },
      { id: "ext3", x: 19, y: 9, type: "extinguisher", collected: false },
      { id: "ext4", x: 6, y: 16, type: "extinguisher", collected: false },
      { id: "mask1", x: 9, y: 5, type: "mask", collected: false },
      { id: "mask2", x: 17, y: 13, type: "mask", collected: false },
      { id: "mask3", x: 7, y: 20, type: "mask", collected: false },
      { id: "tip1", x: 5, y: 12, type: "tip", collected: false, tipId: 7 },
      { id: "tip2", x: 15, y: 4, type: "tip", collected: false, tipId: 8 },
    ],
    obstacles: [
      // Building outer walls
      { x: 0, y: 0, width: 22, height: 1 }, // Top wall
      { x: 0, y: 21, width: 22, height: 1 }, // Bottom wall
      { x: 0, y: 0, width: 1, height: 22 }, // Left wall
      { x: 21, y: 0, width: 1, height: 22 }, // Right wall
      
      // Floor dividers - horizontal corridors
      { x: 1, y: 5, width: 9, height: 1 },
      { x: 12, y: 5, width: 9, height: 1 },
      { x: 1, y: 11, width: 7, height: 1 },
      { x: 10, y: 11, width: 11, height: 1 },
      { x: 1, y: 17, width: 5, height: 1 },
      { x: 8, y: 17, width: 13, height: 1 },
      
      // Floor dividers - vertical corridors
      { x: 5, y: 1, width: 1, height: 4 },
      { x: 5, y: 6, width: 1, height: 5 },
      { x: 5, y: 12, width: 1, height: 5 },
      { x: 5, y: 18, width: 1, height: 3 },
      
      { x: 11, y: 1, width: 1, height: 4 },
      { x: 11, y: 6, width: 1, height: 5 },
      { x: 11, y: 12, width: 1, height: 5 },
      { x: 11, y: 18, width: 1, height: 3 },
      
      { x: 17, y: 1, width: 1, height: 4 },
      { x: 17, y: 6, width: 1, height: 5 },
      { x: 17, y: 12, width: 1, height: 5 },
      { x: 17, y: 18, width: 1, height: 3 },
      
      // Office cubicles and obstacles
      { x: 2, y: 2, width: 2, height: 2 },
      { x: 8, y: 3, width: 2, height: 1 },
      { x: 14, y: 2, width: 2, height: 2 },
      { x: 19, y: 3, width: 1, height: 1 },
      
      { x: 3, y: 8, width: 1, height: 2 },
      { x: 7, y: 7, width: 3, height: 2 },
      { x: 14, y: 8, width: 2, height: 2 },
      
      { x: 2, y: 14, width: 2, height: 2 },
      { x: 8, y: 13, width: 2, height: 2 },
      { x: 15, y: 13, width: 1, height: 3 },
      { x: 19, y: 14, width: 1, height: 2 },
      
      { x: 3, y: 19, width: 1, height: 1 },
      { x: 9, y: 19, width: 1, height: 1 },
      { x: 15, y: 19, width: 2, height: 1 },
    ],
    completed: false,
    unlocked: false,
  },
  {
    id: 5,
    name: "Hospital Evacuation",
    description: "Guide patients and staff through a complex hospital maze during a fire emergency.",
    mapWidth: 24,
    mapHeight: 24,
    startPosition: { x: 3, y: 3 },
    exitPosition: { x: 21, y: 21 },
    timeLimit: 210, // seconds
    hazards: [
      { id: "fire1", x: 5, y: 6, size: 1.3, extinguished: false },
      { id: "fire2", x: 9, y: 4, size: 1, extinguished: false },
      { id: "fire3", x: 12, y: 8, size: 1.5, extinguished: false },
      { id: "fire4", x: 16, y: 5, size: 1.2, extinguished: false },
      { id: "fire5", x: 20, y: 7, size: 1, extinguished: false },
      { id: "fire6", x: 6, y: 12, size: 1.8, extinguished: false },
      { id: "fire7", x: 10, y: 15, size: 1.4, extinguished: false },
      { id: "fire8", x: 15, y: 13, size: 1.6, extinguished: false },
      { id: "fire9", x: 19, y: 16, size: 1.3, extinguished: false },
      { id: "fire10", x: 8, y: 20, size: 1.5, extinguished: false },
      { id: "fire11", x: 14, y: 19, size: 1.2, extinguished: false },
    ],
    collectibles: [
      { id: "ext1", x: 4, y: 5, type: "extinguisher", collected: false },
      { id: "ext2", x: 11, y: 3, type: "extinguisher", collected: false },
      { id: "ext3", x: 18, y: 6, type: "extinguisher", collected: false },
      { id: "ext4", x: 7, y: 11, type: "extinguisher", collected: false },
      { id: "ext5", x: 16, y: 14, type: "extinguisher", collected: false },
      { id: "mask1", x: 6, y: 7, type: "mask", collected: false },
      { id: "mask2", x: 13, y: 5, type: "mask", collected: false },
      { id: "mask3", x: 19, y: 12, type: "mask", collected: false },
      { id: "mask4", x: 9, y: 18, type: "mask", collected: false },
      { id: "tip1", x: 8, y: 8, type: "tip", collected: false, tipId: 9 },
      { id: "tip2", x: 17, y: 9, type: "tip", collected: false, tipId: 10 },
      { id: "tip3", x: 12, y: 17, type: "tip", collected: false, tipId: 1 },
    ],
    obstacles: [
      // Hospital outer walls
      { x: 0, y: 0, width: 24, height: 1 }, // Top wall
      { x: 0, y: 23, width: 24, height: 1 }, // Bottom wall
      { x: 0, y: 0, width: 1, height: 24 }, // Left wall
      { x: 23, y: 0, width: 1, height: 24 }, // Right wall
      
      // Main corridors structure - horizontal
      { x: 1, y: 7, width: 22, height: 1 }, // First floor main corridor
      { x: 1, y: 15, width: 22, height: 1 }, // Second floor main corridor
      
      // Main corridors structure - vertical
      { x: 7, y: 1, width: 1, height: 6 }, // Top left vertical
      { x: 7, y: 8, width: 1, height: 7 }, // Middle left vertical
      { x: 7, y: 16, width: 1, height: 7 }, // Bottom left vertical
      
      { x: 15, y: 1, width: 1, height: 6 }, // Top right vertical
      { x: 15, y: 8, width: 1, height: 7 }, // Middle right vertical
      { x: 15, y: 16, width: 1, height: 7 }, // Bottom right vertical
      
      // Patient room divisions and hospital sections
      // Top left quadrant (Emergency Room)
      { x: 2, y: 3, width: 3, height: 1 },
      { x: 2, y: 5, width: 4, height: 1 },
      { x: 3, y: 1, width: 1, height: 2 },
      { x: 5, y: 2, width: 1, height: 3 },
      
      // Top center quadrant (Surgery)
      { x: 9, y: 2, width: 5, height: 1 },
      { x: 9, y: 5, width: 4, height: 1 },
      { x: 11, y: 3, width: 1, height: 2 },
      
      // Top right quadrant (Intensive Care)
      { x: 17, y: 3, width: 5, height: 1 },
      { x: 18, y: 5, width: 4, height: 1 },
      { x: 17, y: 1, width: 1, height: 2 },
      { x: 20, y: 1, width: 1, height: 2 },
      
      // Middle left quadrant (Pediatrics)
      { x: 2, y: 9, width: 4, height: 1 },
      { x: 3, y: 11, width: 3, height: 1 },
      { x: 2, y: 13, width: 4, height: 1 },
      { x: 3, y: 9, width: 1, height: 2 },
      { x: 5, y: 11, width: 1, height: 2 },
      
      // Middle center quadrant (Nurses Station)
      { x: 9, y: 9, width: 6, height: 2 },
      { x: 9, y: 11, width: 2, height: 1 },
      { x: 13, y: 11, width: 2, height: 1 },
      { x: 9, y: 12, width: 6, height: 1 },
      
      // Middle right quadrant (Laboratory)
      { x: 17, y: 9, width: 5, height: 1 },
      { x: 18, y: 11, width: 4, height: 1 },
      { x: 20, y: 12, width: 1, height: 2 },
      { x: 17, y: 13, width: 3, height: 1 },
      
      // Bottom left quadrant (Radiology)
      { x: 2, y: 17, width: 4, height: 1 },
      { x: 2, y: 19, width: 3, height: 1 },
      { x: 2, y: 21, width: 4, height: 1 },
      { x: 4, y: 19, width: 1, height: 2 },
      
      // Bottom center quadrant (Pharmacy)
      { x: 9, y: 17, width: 5, height: 1 },
      { x: 10, y: 19, width: 3, height: 1 },
      { x: 9, y: 21, width: 5, height: 1 },
      { x: 9, y: 18, width: 1, height: 3 },
      { x: 13, y: 18, width: 1, height: 3 },
      
      // Bottom right quadrant (Exit Path)
      { x: 17, y: 17, width: 5, height: 1 },
      { x: 17, y: 19, width: 3, height: 1 },
      { x: 17, y: 21, width: 2, height: 1 },
      { x: 20, y: 19, width: 1, height: 4 },
    ],
    completed: false,
    unlocked: false,
  },
];
