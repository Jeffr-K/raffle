// Raffle Event Interface
export interface RaffleEvent {
  id: string;
  name: string;
  imageUrl: string; // base64 or upload URL
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  kakaoChannelUrl: string;
  buttonTop: number; // px
  createdAt: string;
}

// User Data Interface
export interface UserData {
  timestamp: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  kakaoFriend: "Y" | "N";
  eventId?: string;
}

// Cafe24 Info Interface
export interface Cafe24Info {
  isLoggedIn: boolean;
  memberId: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}

// Modal Types
export type ModalType =
  | "SIGNUP_REQUIRED"
  | "LOGIN_REQUIRED"
  | "KAKAO_VERIFY"
  | "ALREADY_ENTERED"
  | "ENTRY_COMPLETE"
  | null;

// Message Types for postMessage
export interface MessageData {
  type: string;
  [key: string]: any;
}

export interface ResizeMessage extends MessageData {
  type: "resize";
  height: number;
}

export interface Cafe24InfoMessage extends MessageData {
  type: "cafe24Info";
  info: Cafe24Info;
}

export interface GetCafe24InfoMessage extends MessageData {
  type: "getCafe24Info";
}
