const generateItinerary = async (extractedText) => {
  // This runs without any API key or credits
  console.log("Generating mock itinerary from:", extractedText.substring(0, 100));
  
  // Return realistic mock data
  return {
    destination: "Paris, France",
    startDate: "2024-06-15",
    endDate: "2024-06-20",
    duration: 5,
    summary: "Beautiful trip to Paris with Eiffel Tower, Louvre, and Seine River cruise",
    dailyItinerary: [
      {
        day: 1,
        date: "2024-06-15",
        theme: "Arrival & Landmarks",
        activities: [
          { time: "10:00", activity: "Check into hotel", location: "Le Marais district", notes: "Drop luggage", duration: "1 hour" },
          { time: "14:00", activity: "Eiffel Tower", location: "Champ de Mars", notes: "Book tickets online in advance", duration: "3 hours" },
          { time: "19:00", activity: "Seine River Cruise", location: "Pont Neuf", notes: "Beautiful sunset views", duration: "1.5 hours" }
        ],
        meals: { breakfast: "Hotel", lunch: "Café near Eiffel", dinner: "French Bistro" }
      },
      {
        day: 2,
        date: "2024-06-16",
        theme: "Art & Culture",
        activities: [
          { time: "09:00", activity: "Louvre Museum", location: "1st Arrondissement", notes: "See Mona Lisa, Venus de Milo", duration: "4 hours" },
          { time: "15:00", activity: "Notre-Dame Cathedral", location: "Île de la Cité", notes: "Beautiful Gothic architecture", duration: "1.5 hours" },
          { time: "18:00", activity: "Latin Quarter walking tour", location: "5th Arrondissement", notes: "Historic student district", duration: "2 hours" }
        ],
        meals: { breakfast: "Café", lunch: "Near Louvre", dinner: "Latin Quarter restaurant" }
      },
      {
        day: 3,
        date: "2024-06-17",
        theme: "Shopping & Gardens",
        activities: [
          { time: "10:00", activity: "Champs-Élysées shopping", location: "8th Arrondissement", notes: "Luxury brands", duration: "3 hours" },
          { time: "14:00", activity: "Arc de Triomphe", location: "Place Charles de Gaulle", notes: "Climb to the top", duration: "1.5 hours" },
          { time: "16:00", activity: "Tuileries Garden", location: "Near Louvre", notes: "Relaxing walk", duration: "1 hour" }
        ],
        meals: { breakfast: "Bakery", lunch: "Champs-Élysées cafe", dinner: "Traditional French dinner" }
      },
      {
        day: 4,
        date: "2024-06-18",
        theme: "Day Trip",
        activities: [
          { time: "09:00", activity: "Palace of Versailles", location: "Versailles", notes: "Take RER train", duration: "6 hours" },
          { time: "18:00", activity: "Montmartre & Sacré-Cœur", location: "18th Arrondissement", notes: "Artists district, sunset view", duration: "2 hours" }
        ],
        meals: { breakfast: "Train station", lunch: "Versailles", dinner: "Montmartre bistro" }
      },
      {
        day: 5,
        date: "2024-06-19",
        theme: "Relax & Departure",
        activities: [
          { time: "10:00", activity: "Sainte-Chapelle", location: "Île de la Cité", notes: "Stunning stained glass", duration: "1.5 hours" },
          { time: "13:00", activity: "Last minute shopping", location: "Le Marais", notes: "Boutiques and souvenirs", duration: "2 hours" },
          { time: "17:00", activity: "Depart for airport", location: "CDG Airport", notes: "Arrive 3 hours early", duration: "" }
        ],
        meals: { breakfast: "Café", lunch: "Le Marais", dinner: "Airport" }
      }
    ],
    bookings: {
      flights: [
        { airline: "Air France", flightNumber: "AF123", from: "JFK", to: "CDG", departureDateTime: "2024-06-15 18:30", arrivalDateTime: "2024-06-16 08:00" }
      ],
      hotels: [
        { name: "Hotel Le Marais", checkIn: "2024-06-15", checkOut: "2024-06-20", address: "4th Arrondissement, Paris" }
      ]
    },
    recommendations: {
      restaurants: ["Le Relais de l'Entrecôte", "Breizh Café", "Chez Janou", "L'As du Fallafel"],
      attractions: ["Sainte-Chapelle", "Panthéon", "Centre Pompidou", "Rodin Museum"],
      activities: ["Cooking class", "Wine tasting", "Bike tour", "Opera Garnier"]
    },
    tips: [
      "Book Eiffel Tower tickets 2 months in advance",
      "Get a Paris Museum Pass for multiple attractions",
      "Use Metro - it's efficient and cheap",
      "Learn basic French phrases (Bonjour, Merci, S'il vous plaît)",
      "Beware of pickpockets in tourist areas",
      "Many museums are free on first Sunday of month"
    ],
    weather: "Sunny, 20-25°C (June weather is pleasant)",
    packingSuggestions: [
      "Comfortable walking shoes",
      "Umbrella or light raincoat",
      "Power bank for phone",
      "Universal power adapter",
      "Portable Wi-Fi hotspot or SIM card",
      "Reusable water bottle",
      "Light jacket for evenings"
    ],
    budget: {
      estimatedTotal: "$1200",
      currency: "USD",
      breakdown: { flights: "$500", hotel: "$400", activities: "$200", food: "$100" }
    }
  };
};

module.exports = { generateItinerary };