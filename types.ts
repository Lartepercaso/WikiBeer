export interface Comment {
  id: string;
  user_id: string;
  user_email: string;
  text: string;
  created_at: string;
}

export interface Rating {
  user_id: string;
  value: number;
}

export interface BeerPost {
  id: number;
  name: string;
  brewery: string;
  nation: string;
  type: string;
  abv: number;
  price: number;
  imageUrl: string;
  ratings: Rating[];
  comments: Comment[];
  description?: string;
  created_at?: string;
  user_id?: string;
}

export interface BreweryPost {
  id: number;
  name: string;
  address: string;
  city: string;
  nation: string;
  lat: number;
  lng: number;
  imageUrl: string;
  description?: string;
  ratings: Rating[];
  comments: Comment[];
  user_id?: string;
  created_at?: string;
}


export interface User {
  id: string;
  email?: string;
}