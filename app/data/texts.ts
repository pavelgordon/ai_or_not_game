interface GameText {
  id: number;
  content: string;
  isAI: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const texts: GameText[] = [
  // Easy Level
  {
    id: 1,
    content: "Hello! Today I will explain quantum computing using technical jargon and precise mathematical terminology. Quantum bits, or qubits, exist in multiple states simultaneously due to quantum superposition, enabling exponential computational advantages over classical systems.",
    isAI: true,
    difficulty: 'easy'
  },
  {
    id: 2,
    content: "My dog destroyed my favorite shoes yesterday. I was mad at first, but when I saw his guilty face and wagging tail, I couldn't help but laugh. He's lucky he's so cute!",
    isAI: false,
    difficulty: 'easy'
  },
  {
    id: 3,
    content: "According to my analysis, the optimal solution involves leveraging synergistic methodologies to maximize stakeholder value while maintaining robust scalability parameters within acceptable operational thresholds.",
    isAI: true,
    difficulty: 'easy'
  },
  // Medium Level
  {
    id: 4,
    content: "The sunset painted the sky in shades of orange and purple, casting long shadows across the beach. Seabirds circled overhead, their calls echoing across the waves as the day drew to a close.",
    isAI: true,
    difficulty: 'medium'
  },
  {
    id: 5,
    content: "Last night's game was intense! We were down by two with 30 seconds left when Mike hit that crazy three-pointer. The crowd went absolutely nuts. My voice is still hoarse from screaming.",
    isAI: false,
    difficulty: 'medium'
  },
  {
    id: 6,
    content: "The research suggests a correlation between meditation practice and reduced stress levels. Participants who meditated for 20 minutes daily reported 35% lower anxiety scores after eight weeks.",
    isAI: true,
    difficulty: 'medium'
  },
  // Hard Level
  {
    id: 7,
    content: "I've been thinking about how we perceive time lately. Sometimes a minute feels like an hour, and other times a whole day passes in what feels like moments. Maybe time isn't as linear as we think.",
    isAI: false,
    difficulty: 'hard'
  },
  {
    id: 8,
    content: "The coffee shop was quiet this morning. A woman in a red scarf typed furiously on her laptop while her tea grew cold. Outside, fallen leaves skittered across the sidewalk in the autumn breeze.",
    isAI: true,
    difficulty: 'hard'
  },
  {
    id: 9,
    content: "Climate change affects different regions in complex ways. While some areas experience severe drought, others face increased rainfall and flooding. Local ecosystems adapt differently to these changes.",
    isAI: true,
    difficulty: 'hard'
  }
]; 