// api.rs
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

// Room struct
#[derive(Serialize, Deserialize, Debug)]
pub struct Room {
    id: Option<i32>, // Auto-increment ID
    room_number: String,
    room_type: String,
    status: String,
}

// Resident struct
#[derive(Serialize, Deserialize, Debug)]
pub struct Resident {
    pub id: Option<i32>,
    pub first_name: String,
    pub last_name: String,
    pub email_address: String,
    pub phone_number: String,
    pub date_of_birth: String,
    pub room_number: String,
    pub duration_of_stay: u32,
    pub emergency_contact_name: String,
    pub relationship_to_resident: String,
    pub emergency_contact_phone_number: String,
    pub medical_notes: Option<String>,
    pub former_address: String,
}

// Fetch all rooms
#[tauri::command]
pub fn fetch_rooms() -> Result<Vec<Room>, String> {
    let conn = Connection::open("src-tauri/db/app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, room_number, room_type, status FROM rooms").map_err(|e| e.to_string())?;
    let room_iter = stmt.query_map([], |row| {
        Ok(Room {
            id: row.get(0)?,
            room_number: row.get(1)?,
            room_type: row.get(2)?,
            status: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    room_iter.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// Add a new room
#[tauri::command]
pub fn add_room(room: Room) -> Result<String, String> {
    let conn = Connection::open("src-tauri/db/app.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO rooms (room_number, room_type, status) VALUES (?1, ?2, ?3)",
        params![room.room_number, room.room_type, room.status],
    )
    .map_err(|e| e.to_string())?;
    Ok("Room added successfully".to_string())
}

// Update room status
#[tauri::command]
pub fn update_room_status(room_number: String, status: String) -> Result<String, String> {
    let conn = Connection::open("src-tauri/db/app.db").map_err(|e| e.to_string())?;
    conn.execute("UPDATE rooms SET status = ?1 WHERE room_number = ?2", params![status, room_number])
        .map_err(|e| e.to_string())?;
    Ok(format!("Room status updated to {}", status))
}

// Delete a room
#[tauri::command]
pub fn delete_room(room_number: String) -> Result<String, String> {
    let conn = Connection::open("src-tauri/db/app.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM rooms WHERE room_number = ?1", params![room_number])
        .map_err(|e| e.to_string())?;
    Ok("Room deleted successfully".to_string())
}

// Fetch all residents
#[tauri::command]
pub fn fetch_all_residents() -> Result<Vec<Resident>, String> {
    let conn = Connection::open("src-tauri/db/app.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT * FROM residents").map_err(|e| e.to_string())?;
    let residents = stmt
        .query_map([], |row| {
            Ok(Resident {
                id: row.get(0)?,
                first_name: row.get(1)?,
                last_name: row.get(2)?,
                email_address: row.get(3)?,
                phone_number: row.get(4)?,
                date_of_birth: row.get(5)?,
                room_number: row.get(6)?,
                duration_of_stay: row.get(7)?,
                emergency_contact_name: row.get(8)?,
                relationship_to_resident: row.get(9)?,
                emergency_contact_phone_number: row.get(10)?,
                medical_notes: row.get(11)?,
                former_address: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(residents)
}
