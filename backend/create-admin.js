import bcrypt from 'bcryptjs';
import { pool } from './src/database/connection.js';

const createAdminUser = async () => {
  try {
    console.log('🔐 Creating default admin user...');
    
    // Admin credentials
    const adminEmail = 'admin@marinaglen.co.za';
    const adminPassword = 'Marina2024!'; // Change this to your preferred password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Use existing password or reset if needed');
      return;
    }
    
    // Create admin user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, role`,
      [adminEmail, hashedPassword, 'Marina Glen', 'Admin', 'admin', '+27 39 312 1234']
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role:', result.rows[0].role);
    console.log('🆔 ID:', result.rows[0].id);
    console.log('\n🌐 Login at: http://localhost:3001/booking-system/login');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  } finally {
    await pool.end();
  }
};

createAdminUser();