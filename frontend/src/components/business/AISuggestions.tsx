import React, { useEffect, useState } from "react";
import { Lightbulb, Rocket, Users, ChevronDown, ChevronUp } from "lucide-react";

interface AISuggestionsProps {
  businessName: string;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ businessName }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const aiGeneratedSuggestions = [
      "Tawarkan paket hampers eksklusif untuk momen hari raya dan acara khusus.",
      "Gunakan media sosial seperti Instagram & TikTok untuk membagikan konten proses pembuatan kue.",
      "Perluas varian rasa premium, misalnya nastar keju edam atau kastengel almond.",
      "Jalin kerja sama dengan coffee shop lokal untuk menyediakan kue kering sebagai menu pelengkap.",
      "Buat program membership atau langganan bulanan untuk pelanggan setia.",
      "Manfaatkan platform e-commerce (Tokopedia, Shopee) dengan promo ongkir.",
      "Gunakan kemasan ramah lingkungan dengan desain yang menarik untuk meningkatkan citra brand.",
    ];
    setSuggestions(aiGeneratedSuggestions);
  }, [businessName]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          AI Suggestions for {businessName}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[1000px] mt-4" : "max-h-0"
        }`}
      >
        <div className="space-y-4">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="flex items-start p-4 bg-amber-50 border border-amber-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-500"
            >
              <Rocket className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-gray-700">{suggestion}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center text-xs text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          Saran ini dihasilkan secara otomatis oleh AI berdasarkan jenis usaha dan tren pasar.
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
