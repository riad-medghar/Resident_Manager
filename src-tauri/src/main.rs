#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            println!("Tauri app started. You can now call PocketBase APIs from your frontend.");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
