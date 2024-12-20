// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
use api::{add_resident, fetch_rooms_by_status};
use tauri_plugin_http::init as http_init; // Import the HTTP plugin

fn main() {
    tauri::Builder::default()
        .plugin(http_init()) // Initialize the HTTP plugin
        .invoke_handler(tauri::generate_handler![
            add_resident,
            fetch_rooms_by_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
