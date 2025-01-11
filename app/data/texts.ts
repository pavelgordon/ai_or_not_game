interface GameText {
  id: number;
  content: string;
  isAI: boolean;
}

export const texts: GameText[] = [
  {
    id: 1,
    content: "The quantum computer performs calculations by manipulating quantum bits, or qubits, which can exist in multiple states simultaneously due to a phenomenon called superposition. This allows quantum computers to solve certain problems exponentially faster than classical computers.",
    isAI: true
  },
  {
    id: 2,
    content: "Last summer, I spent three weeks hiking the Appalachian Trail. The blisters on my feet were awful, but the sunrise views from the mountaintops made it all worth it. I'll never forget sharing trail mix with complete strangers who became friends.",
    isAI: false
  },
  {
    id: 3,
    content: "Neural networks process information in a manner analogous to biological brains, utilizing interconnected nodes organized in layers. Each connection is weighted, allowing the network to learn patterns through iterative adjustment of these weights during training.",
    isAI: true
  },
  {
    id: 4,
    content: "My grandmother's cookie recipe is a mess of crossed-out measurements and coffee-stained notes. She never measures anything exactly - just a pinch of this, a handful of that. Somehow they turn out perfect every time.",
    isAI: false
  },
  {
    id: 5,
    content: "The blockchain technology ensures transparency and immutability through a distributed ledger system where each transaction is cryptographically linked to previous transactions, creating an unalterable chain of information blocks.",
    isAI: true
  }
]; 