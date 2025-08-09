import api from "../lib/api";

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UserPreferences {
  industry?: string;
  minMarketCap?: number;
  maxMarketCap?: number;
  riskTolerance?: string;
}

export interface InvestmentChatRequest {
  message: string;
  preferences?: UserPreferences;
}

export interface InvestmentChatResponse {
  success: boolean;
  data: {
    response: string;
  };
  message: string;
}

export class ChatService {
  private static readonly BASE_URL = "/genai";

  // Send message and get AI investment advice
  static async sendMessage(message: string, preferences?: UserPreferences): Promise<string> {
    try {
      const requestData: InvestmentChatRequest = {
        message,
        preferences: preferences || {},
      };

      const response = await api.post<InvestmentChatResponse>(`${this.BASE_URL}/investment-advice`, requestData);

      if (response.data.success && response.data.data) {
        return response.data.data.response;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw new Error("Failed to get investment advice. Please try again.");
    }
  }

  // Generate sample questions based on current market context
  static getSampleQuestions(): string[] {
    return [
      "Bisnis mana yang paling menguntungkan untuk investasi saat ini?",
      "Saya tertarik investasi di teknologi, ada rekomendasi?",
      "Bagaimana cara menilai risiko investasi bisnis?",
      "Berapa minimal investasi yang diperlukan?",
      "Industri apa yang sedang berkembang pesat?",
      "Bisnis dengan ROI terbaik yang tersedia?",
    ];
  }

  // Helper to create user preferences from filters
  static createPreferences(filters: { industry?: string; searchTerm?: string }): UserPreferences {
    const preferences: UserPreferences = {};

    if (filters.industry) {
      preferences.industry = filters.industry;
    }

    return preferences;
  }
}
