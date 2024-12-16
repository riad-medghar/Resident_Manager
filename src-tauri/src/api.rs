use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Resident {
    first_name: String,
    last_name: String,
    email_address: String,
    phone_number: String,
    date_of_birth: String,
    room_number: String,
    duration_of_stay: u32,
    emergency_contact_name: String,
    relationship_to_resident: String,
    emergency_contact_phone_number: String,
    medical_notes: Option<String>,
    former_address: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PocketBaseResponse<T> {
    page: u32,
    #[serde(rename = "perPage")]
    per_page: u32,
    #[serde(rename = "totalPages")]
    total_pages: u32,
    #[serde(rename = "totalItems")]
    total_items: u32,
    items: Vec<T>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Room {
    #[serde(rename = "collectionId")]
    collection_id: String,
    #[serde(rename = "collectionName")]
    collection_name: String,
    id: String,
    #[serde(rename = "Room_Number")]
    Room_Number: String,
    #[serde(rename = "Status")]
    Status: String,
    #[serde(rename = "Type")]
    Type: String,
    created: String,
}

#[derive(Serialize, Deserialize)]
pub struct RoomsByStatus {
    available: Vec<Room>,
    occupied: Vec<Room>,
    under_maintenance: Vec<Room>,
}

#[tauri::command]
pub async fn add_resident(resident: Resident, api_url: String) -> Result<String, String> {
    let client = Client::new();
    let base_url = api_url.trim_end_matches('/');

    // Construct room URL correctly
    let room_url = format!(
        "{}/api/collections/rooms/records/{}",
        base_url, resident.room_number
    );
    let room_response = client
        .get(&room_url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !room_response.status().is_success() {
        return Err("Room not found or unavailable".to_string());
    }

    let room: Room = room_response
        .json()
        .await
        .map_err(|e| format!("Failed to parse room data: {}", e))?;

    if room.Status != "available" {
        return Err("Room is not available".to_string());
    }

    // Update room status to "occupied"
    let update_url = format!(
        "{}/api/collections/rooms/records/{}",
        base_url, resident.room_number
    );
    let update_response = client
        .put(&update_url)
        .json(&serde_json::json!({ "Status": "occupied" }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !update_response.status().is_success() {
        return Err("Failed to update room status".to_string());
    }

    // Construct resident URL correctly
    let resident_url = format!("{}/api/collections/residents/records", base_url);
    let resident_response = client
        .post(&resident_url)
        .json(&resident)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if resident_response.status().is_success() {
        Ok("Resident added successfully".to_string())
    } else {
        Err("Failed to add resident".to_string())
    }
}

#[tauri::command]
pub async fn fetch_rooms_by_status(api_url: String) -> Result<RoomsByStatus, String> {
    let client = Client::new();
    let base_url = api_url.trim_end_matches('/');

    // Fetch all rooms
    let response = client
        .get(&format!("{}/api/collections/rooms/records", base_url))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        // Parse the response into PocketBaseResponse with Room items
        let pb_response: PocketBaseResponse<Room> = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse room data: {}", e))?;

        // Categorize rooms by status
        let mut categorized = RoomsByStatus {
            available: Vec::new(),
            occupied: Vec::new(),
            under_maintenance: Vec::new(),
        };

        for room in pb_response.items {
            match room.Status.as_str() {
                "available" => categorized.available.push(room),
                "occupied" => categorized.occupied.push(room),
                "under maintenance" => categorized.under_maintenance.push(room),
                _ => (), // Ignore any other status
            }
        }

        Ok(categorized)
    } else {
        Err("Failed to fetch rooms".to_string())
    }
}
