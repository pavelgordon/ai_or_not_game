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
      content: "Cats are cute animals that love to nap in the sun. They also enjoy playing with strings and chasing laser pointers.",
      isAI: false,
      difficulty: 'easy'
    },
    {
      id: 2,
      content: "The universe is vast and mysterious, with billions of galaxies, each containing millions of stars and planets.",
      isAI: true,
      difficulty: 'easy'
    },
    {
      id: 3,
      content: "Just finished watching that movie everyone was talking about. It was... okay. Not great, not terrible. Just okay.",
      isAI: false,
      difficulty: 'easy'
    },
    {
      id: 4,
      content: "The benefits of regular exercise include improved cardiovascular health, increased energy, and enhanced mental clarity.",
      isAI: true,
      difficulty: 'easy'
    },
    {
      id: 5,
      content: "My cat knocked over a glass of water and just stared at me as if it was my fault. Cats are such drama queens!",
      isAI: false,
      difficulty: 'easy'
    },
    // Medium Level
    {
      id: 6,
      content: "The mountains stood tall against the horizon, their peaks dusted with snow, while the valley below was alive with wildflowers.",
      isAI: true,
      difficulty: 'medium'
    },
    {
      id: 7,
      content: "I tried that new recipe you sent me. The pasta turned out amazing, but I burned the garlic bread. Typical me!",
      isAI: false,
      difficulty: 'medium'
    },
    {
      id: 8,
      content: "In a recent study, scientists discovered that certain marine animals can adapt their diets based on environmental changes, showcasing remarkable resilience.",
      isAI: true,
      difficulty: 'medium'
    },
    {
      id: 9,
      content: "There’s something magical about waking up early, brewing a cup of coffee, and watching the world slowly come alive.",
      isAI: false,
      difficulty: 'medium'
    },
    {
      id: 10,
      content: "The intricate design of ancient architecture often reflects the culture's deep connection with nature and spirituality.",
      isAI: true,
      difficulty: 'medium'
    },
    // Hard Level
    {
      id: 11,
      content: "Sometimes I wonder if dreams are just our brain’s way of processing reality or if they’re glimpses into alternate universes.",
      isAI: false,
      difficulty: 'hard'
    },
    {
      id: 12,
      content: "The artist's brush moved with deliberate precision, layering colors and textures to bring the abstract concept to life on the canvas.",
      isAI: true,
      difficulty: 'hard'
    },
    {
      id: 13,
      content: "Economists debate whether the recent market trends are indicative of a deeper structural shift or merely a cyclical fluctuation.",
      isAI: true,
      difficulty: 'hard'
    },
    {
      id: 14,
      content: "I watched as the waves crashed against the rocks, each one carrying away tiny fragments of the shoreline, slowly reshaping the coast.",
      isAI: false,
      difficulty: 'hard'
    },
    {
      id: 15,
      content: "Artificial intelligence has made significant strides, yet ethical questions around its deployment remain largely unresolved.",
      isAI: true,
      difficulty: 'hard'
    }
  ];
  