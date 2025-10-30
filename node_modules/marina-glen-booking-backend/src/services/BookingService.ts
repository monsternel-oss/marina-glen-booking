import { pool } from '../database/connection.js';

export interface Booking {
  id: string;
  bookingReference: string;
  guestId: string;
  roomId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  baseRate: number;
  adminFee: number;
  breakageDeposit: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paymentMethod?: string;
  specialRequests?: string;
  seasonApplied?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingData {
  guestId: string;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  baseRate: number;
  adminFee: number;
  breakageDeposit: number;
  totalAmount: number;
  specialRequests?: string;
  seasonApplied?: string;
}

export class BookingService {
  
  static async getAllBookings(): Promise<Booking[]> {
    const query = `
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        g.phone as guest_phone,
        rt.unit_type,
        r.room_number
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN room_types rt ON b.room_type_id = rt.id
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }
  
  static async getBookingById(id: string): Promise<Booking | null> {
    const query = `
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        g.phone as guest_phone,
        rt.unit_type,
        r.room_number
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN room_types rt ON b.room_type_id = rt.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE b.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
  
  static async getBookingByReference(reference: string): Promise<Booking | null> {
    const query = `
      SELECT 
        b.*,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        g.phone as guest_phone,
        rt.unit_type,
        r.room_number
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN room_types rt ON b.room_type_id = rt.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE b.booking_reference = $1
    `;
    
    const result = await pool.query(query, [reference]);
    return result.rows[0] || null;
  }
  
  static async createBooking(data: CreateBookingData): Promise<Booking> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Generate booking reference
      const refResult = await client.query('SELECT generate_booking_reference() as ref');
      const bookingReference = refResult.rows[0].ref;
      
      // Calculate nights
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
      
      // Find available room of the specified type
      const roomQuery = `
        SELECT id FROM rooms 
        WHERE room_type_id = $1 
        AND status = 'available'
        AND id NOT IN (
          SELECT room_id FROM bookings 
          WHERE room_id IS NOT NULL
          AND status NOT IN ('cancelled')
          AND (
            (check_in <= $2 AND check_out > $2) OR
            (check_in < $3 AND check_out >= $3) OR
            (check_in >= $2 AND check_out <= $3)
          )
        )
        LIMIT 1
      `;
      
      const roomResult = await client.query(roomQuery, [data.roomTypeId, data.checkIn, data.checkOut]);
      const roomId = roomResult.rows[0]?.id;
      
      // Create booking
      const insertQuery = `
        INSERT INTO bookings (
          booking_reference, guest_id, room_id, room_type_id, check_in, check_out,
          nights, guests_count, base_rate, admin_fee, breakage_deposit, total_amount,
          special_requests, season_applied
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      
      const values = [
        bookingReference,
        data.guestId,
        roomId,
        data.roomTypeId,
        data.checkIn,
        data.checkOut,
        nights,
        data.guestsCount,
        data.baseRate,
        data.adminFee,
        data.breakageDeposit,
        data.totalAmount,
        data.specialRequests,
        data.seasonApplied
      ];
      
      const result = await client.query(insertQuery, values);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id')
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [id, ...Object.keys(updates)
      .filter(key => key !== 'id')
      .map(key => updates[key as keyof Booking])];
    
    const query = `
      UPDATE bookings 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  static async cancelBooking(id: string, cancelledBy: string): Promise<Booking> {
    const query = `
      UPDATE bookings 
      SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP, cancelled_by = $2
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, cancelledBy]);
    return result.rows[0];
  }
  
  static async getAvailableRooms(roomTypeId: number, checkIn: string, checkOut: string): Promise<any[]> {
    const query = `
      SELECT r.*, rt.unit_type
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.room_type_id = $1 
      AND r.status = 'available'
      AND r.id NOT IN (
        SELECT room_id FROM bookings 
        WHERE room_id IS NOT NULL
        AND status NOT IN ('cancelled')
        AND (
          (check_in <= $2 AND check_out > $2) OR
          (check_in < $3 AND check_out >= $3) OR
          (check_in >= $2 AND check_out <= $3)
        )
      )
      ORDER BY r.room_number
    `;
    
    const result = await pool.query(query, [roomTypeId, checkIn, checkOut]);
    return result.rows;
  }
}

export default BookingService;