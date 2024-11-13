import { create } from 'zustand';

interface GPTState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  generateResponse: (prompt: string) => Promise<string>;
}

// Mock responses based on chess context
const responses = {
  opening: [
    "Focus on developing your pieces and controlling the center.",
    "Consider castling to protect your king.",
    "Try to avoid moving the same piece multiple times in the opening."
  ],
  middlegame: [
    "Look for tactical opportunities and piece coordination.",
    "Create and exploit weaknesses in the opponent's position.",
    "Maintain control of key squares and open files."
  ],
  endgame: [
    "Activate your king and centralize your pieces.",
    "Push passed pawns when possible.",
    "Focus on piece coordination and king safety."
  ]
};

export const useGPT = create<GPTState>((set) => ({
  isInitialized: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        isInitialized: true,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize AI';
      set({ 
        error: errorMessage,
        isLoading: false,
        isInitialized: false
      });
      throw error;
    }
  },

  generateResponse: async (prompt: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine game phase from prompt
      let phase = 'middlegame';
      if (prompt.toLowerCase().includes('opening')) {
        phase = 'opening';
      } else if (prompt.toLowerCase().includes('endgame')) {
        phase = 'endgame';
      }

      // Get relevant responses for the phase
      const phaseResponses = responses[phase as keyof typeof responses];
      const response = phaseResponses[Math.floor(Math.random() * phaseResponses.length)];

      // Add position-specific details if available
      const positionDetails = prompt.match(/FEN: ([^\\n]+)/);
      if (positionDetails) {
        return `Based on the current position:\n${response}\n\nConsider the specific features of this position and adjust your strategy accordingly.`;
      }

      set({ isLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },
}));