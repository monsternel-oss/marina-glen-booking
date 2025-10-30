import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, testConnection } from './connection.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runMigration = async () => {
    try {
        console.log('🚀 Starting database migration...');
        // Test connection first
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('📝 Executing database schema...');
        await pool.query(schema);
        console.log('✅ Database migration completed successfully');
        // Insert default data
        await insertDefaultData();
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    finally {
        await pool.end();
    }
};
const insertDefaultData = async () => {
    try {
        console.log('📦 Inserting default data...');
        // Insert default room types
        await pool.query(`
      INSERT INTO room_types (unit_type, high_season_rate, mid_season_rate, low_season_rate, min_stay, admin_fee, breakage_deposit, capacity, amenities, description, color)
      VALUES 
      ('4 Sleeper Unit', 1400, 1250, 1100, 2, 300, 800, 4, ARRAY['Ocean View', 'Air Conditioning', 'WiFi', 'Kitchen', 'Parking', 'Balcony'], 'Comfortable oceanfront unit perfect for small families', 'blue'),
      ('6 Sleeper Unit', 2100, 1850, 1600, 3, 400, 1000, 6, ARRAY['Ocean View', 'Air Conditioning', 'WiFi', 'Full Kitchen', 'Parking', 'Balcony', 'BBQ Area'], 'Spacious villa with premium amenities for larger families', 'purple'),
      ('Bigger 6 sleeper Unit', 2500, 2200, 1900, 3, 500, 1200, 6, ARRAY['Ocean View', 'Air Conditioning', 'WiFi', 'Full Kitchen', 'Parking', 'Balcony', 'BBQ Area', 'Private Garden'], 'Premium large unit with extra space and amenities', 'orange')
      ON CONFLICT DO NOTHING
    `);
        // Insert sample rooms
        await pool.query(`
      INSERT INTO rooms (room_number, room_type_id, status, floor)
      VALUES 
      ('A101', 1, 'available', 1),
      ('A102', 1, 'available', 1),
      ('A201', 1, 'available', 2),
      ('B101', 2, 'available', 1),
      ('B102', 2, 'available', 1),
      ('B201', 2, 'available', 2),
      ('C101', 3, 'available', 1),
      ('C102', 3, 'available', 1)
      ON CONFLICT DO NOTHING
    `);
        // Insert default seasonal calendar
        const currentYear = new Date().getFullYear();
        await pool.query(`
      INSERT INTO seasonal_calendar (room_type_id, start_date, end_date, season)
      VALUES 
      (1, '${currentYear}-12-15', '${currentYear + 1}-01-15', 'high'),
      (1, '${currentYear}-06-15', '${currentYear}-09-15', 'high'),
      (1, '${currentYear}-04-01', '${currentYear}-06-14', 'mid'),
      (1, '${currentYear}-09-16', '${currentYear}-11-30', 'mid'),
      (1, '${currentYear}-01-16', '${currentYear}-03-31', 'low'),
      (2, '${currentYear}-12-15', '${currentYear + 1}-01-15', 'high'),
      (2, '${currentYear}-06-15', '${currentYear}-09-15', 'high'),
      (2, '${currentYear}-04-01', '${currentYear}-06-14', 'mid'),
      (2, '${currentYear}-09-16', '${currentYear}-11-30', 'mid'),
      (2, '${currentYear}-01-16', '${currentYear}-03-31', 'low'),
      (3, '${currentYear}-12-15', '${currentYear + 1}-01-15', 'high'),
      (3, '${currentYear}-06-15', '${currentYear}-09-15', 'high'),
      (3, '${currentYear}-04-01', '${currentYear}-06-14', 'mid'),
      (3, '${currentYear}-09-16', '${currentYear}-11-30', 'mid'),
      (3, '${currentYear}-01-16', '${currentYear}-03-31', 'low')
      ON CONFLICT DO NOTHING
    `);
        // Insert default homepage settings
        await pool.query(`
      INSERT INTO homepage_settings (setting_key, setting_value)
      VALUES 
      ('hero_section', '{"title": "Marina Glen Holiday Resort", "subtitle": "Your Perfect Seaside Escape", "backgroundImage": "/images/hero-bg.jpg"}'),
      ('contact_info', '{"phone": "+27 39 312 1234", "email": "info@marinaglen.co.za", "address": "17 Mars Road, Marina Beach, KZN"}'),
      ('amenities', '["Ocean View", "Swimming Pool", "Restaurant", "Free WiFi", "Parking", "Beach Access", "BBQ Facilities", "Laundry Service"]')
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ Default data inserted successfully');
    }
    catch (error) {
        console.error('❌ Failed to insert default data:', error);
        throw error;
    }
};
// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigration();
}
export { runMigration, insertDefaultData };
//# sourceMappingURL=migrate.js.map