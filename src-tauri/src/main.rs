// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
use api::{add_resident, fetch_rooms_by_status};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_resident, fetch_rooms_by_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}