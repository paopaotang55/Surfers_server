export interface RoomListInterface {
  id: number;
  host_id: number;
  host_name: string;
  location_name: string;
  date: string;
  spot_name: string;
}

export interface ChatDBInterface {
  user_id: number;
  post_id: number;
  text: string;
}
