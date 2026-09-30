"""
Database initialization using SQLite.
Stores site metadata, historical observations, and alerts.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "aquawatch.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS sites (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            river TEXT,
            basin TEXT,
            description TEXT,
            status TEXT DEFAULT 'active',
            is_ungauged INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site_id TEXT NOT NULL,
            date TEXT NOT NULL,
            water_area REAL,
            avg_width REAL,
            discharge REAL,
            turbidity REAL,
            flood_risk REAL,
            anomaly_flag INTEGER DEFAULT 0,
            ndwi_sim REAL,
            rainfall_proxy REAL,
            FOREIGN KEY (site_id) REFERENCES sites(id)
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site_id TEXT NOT NULL,
            site_name TEXT,
            alert_type TEXT,
            severity TEXT,
            message TEXT,
            timestamp TEXT,
            acknowledged INTEGER DEFAULT 0
        );
    """)

    conn.commit()
    conn.close()
