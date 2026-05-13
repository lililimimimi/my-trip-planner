export interface Attraction {
  name: string;
  address: string;
  duration: number;
  description: string;
  longitude: number;
  latitude: number;
  ticket_price: number;
  tag?: string;
}

export interface Meal {
  type: "breakfast" | "lunch" | "dinner";
  name: string;
  address: string;
  description: string;
  cost: number;
  longitude: number;
  latitude: number;
}

export interface Hotel {
  name?: string;
  area: string;
  type: string;
  address?: string;
  rating?: string;
  tags?: string[];
  estimated_cost: number;
  reason?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  attractions: Attraction[];
  meals: Meal[];
  hotel: Hotel;
  warnings: string[];
}

export interface Budget {
  attractions: number;
  meals: number;
  hotels: number;
  transport: number;
  total: number;
}

export interface TripPlan {
  city: string;
  days: DayPlan[];
  budget: Budget;
  tips: string;
}

export interface ChatResponse {
  message: string;
  trip_plan: TripPlan | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  trip_plan?: TripPlan | null;
}

export interface Attraction {
  name: string;
  address: string;
  duration: number;
  description: string;
  longitude: number;
  latitude: number;
  ticket_price: number;
  tips?: string;
  time?: string;
  category?: string;
}

export interface Meal {
  type: "breakfast" | "lunch" | "dinner";
  name: string;
  address: string;
  description: string;
  cost: number;
  longitude: number;
  latitude: number;
  image?: string;
}

export interface Hotel {
  area: string;
  type: string;
  estimated_cost: number;
  reason?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  attractions: Attraction[];
  meals: Meal[];
  hotel: Hotel;
  warnings: string[];
  image?: string;
  tags?: string[];
  summary?: string;
}

export interface Budget {
  attractions: number;
  meals: number;
  hotels: number;
  transport: number;
  total: number;
}

export interface LocalFood {
  name: string;
  description: string;
  price: string;
  emoji: string;
}

export interface TripPlan {
  city: string;
  days: DayPlan[];
  budget: Budget;
  tips: string;
  weather?: string;
  pace?: string;
  local_foods?: LocalFood[];
}

export interface ChatResponse {
  message: string;
  trip_plan: TripPlan | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  trip_plan?: TripPlan | null;
}
