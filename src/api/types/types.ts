export interface Passenger {
  _id: string;
  passengerId: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface PassengersResponse {
  users: Passenger[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PassengerStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
}

export * from "./ride.type";
export * from "./support.type";
export * from "./sos.type";
export * from "./passengers-waiting";






 