#![allow(unused_variables)]
#![allow(unused_imports)]

use std::{error::Error, fs, net::UdpSocket};
use rosc::{decoder, OscPacket};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    // Return the Result directly; no need to clone
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn startOscServer() -> Result<(), String> {
    // 1) Fix the bind address (single colon) and unwrap with `?`
    let socket = UdpSocket::bind("0.0.0.0:9001")
        .map_err(|e| format!("Failed to bind UDP socket: {}", e))?;

    println!("Listening for OSC on port 9001…");

    // 2) Declare a 1024-byte buffer correctly
    let mut buf = [0u8; 1024];

    loop {
        // 3) Unwrap the recv_from Result with `?`
        let (size, addr) = socket
            .recv_from(&mut buf)
            .map_err(|e| format!("Receive error: {}", e))?;

        match decoder::decode(&buf[..size]) {
            Ok(packet) => handle_packet(packet, addr.to_string()),
            Err(err)  => eprintln!("Failed to decode OSC packet: {}", err),
        }
    }
}

fn handle_packet(packet: OscPacket, source: String) {
    match packet {
        OscPacket::Message(msg) => {
            println!("\n▶ From {}:", source);
            println!("  Address: {}", msg.addr);
            println!("  Arguments: {:?}", msg.args);
        }
        OscPacket::Bundle(bundle) => {
            println!("\n▶ Bundle from {}: timetag={:?}", source, bundle.timetag);
            for inner in bundle.content {
                handle_packet(inner, source.clone());
            }
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            read_file,
            startOscServer
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
