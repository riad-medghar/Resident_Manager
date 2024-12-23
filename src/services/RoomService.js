import { invoke } from "@tauri-apps/api/core";

const apiUrl = "http://127.0.0.1:8090";

const RoomService = {
    fetchRooms: async () => {
      return await invoke("fetch_all_rooms", { apiUrl });
    },
    addRoom: async (room) => {
      return await invoke("add_room", { apiUrl, room });
    },
    updateRoomStatus: async (roomNumber, status) => {
      return await invoke("update_room_status", { apiUrl, roomNumber, status });
    },
    deleteRoom: async (roomNumber) => {
      return await invoke("delete_room", { apiUrl, roomNumber });
    },
  };
  
  export default RoomService;
  
