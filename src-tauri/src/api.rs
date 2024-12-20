use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::command;
// Removed unused import: use serde_json::Value;

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
    room_number: String,
    status: String,
    room_type: String,
    created: String,

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")] // To handle top-level fields
pub struct RoomsByStatus {
    available: Vec<Room>,
    occupied: Vec<Room>,
    maintenance: Vec<Room>, // Ensure this matches the JSON field
}

#[command] // Ensure the command attribute is correctly applied
pub async fn add_resident(resident: Resident, api_url: String) -> Result<String, String> {
    let client = reqwest::Client::new(); // Using tauri_plugin_http's reqwest
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

    if room.status.to_lowercase() != "available" {
        return Err("Room is not available".to_string());
    }

    // Update room status to "occupied"
    let update_url = format!(
        "{}/api/collections/rooms/records/{}",
        base_url, resident.room_number
    );
    let update_response = client
        .put(&update_url)
        .json(&serde_json::json!({ "status": "occupied" })) // Ensure correct case for the status field
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

#[command] // Ensure the command attribute is correctly applied
pub async fn fetch_rooms_by_status(api_url: String) -> Result<RoomsByStatus, String> {
    let client = reqwest::Client::new(); // Using tauri_plugin_http's reqwest
    let base_url = api_url.trim_end_matches('/');

    // Fetch all rooms
    let response = client
        .get(&format!("{}/api/collections/rooms/records", base_url))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        // Read the raw response text for debugging
        let response_text = response
            .text()
            .await
            .map_err(|e| format!("Failed to read response text: {}", e))?;

        // Log the raw JSON response
        println!("Raw JSON Response: {}", response_text);

        // Attempt to deserialize the response
        let pb_response_result: Result<PocketBaseResponse<Room>, serde_json::Error> =
            serde_json::from_str(&response_text);

        let pb_response = match pb_response_result {
            Ok(res) => res,
            Err(e) => {
                return Err(format!("Failed to parse room data: {}", e));
            }
        };

        // Categorize rooms by status
        let mut categorized = RoomsByStatus {
            available: Vec::new(),
            occupied: Vec::new(),
            maintenance: Vec::new(),
        };

        for room in pb_response.items {
            match room.status.to_lowercase().as_str() {
                "available" => categorized.available.push(room),
                "occupied" => categorized.occupied.push(room),
                "maintenance" => categorized.maintenance.push(room),
                _ => (), // Ignore any other status
            }
        }

        Ok(categorized)
    } else {
        Err(format!(
            "Failed to fetch rooms. Status Code: {}",
            response.status()
        ))
    }
}
