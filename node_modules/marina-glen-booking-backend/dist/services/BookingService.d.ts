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
export declare class BookingService {
    static getAllBookings(): Promise<Booking[]>;
    static getBookingById(id: string): Promise<Booking | null>;
    static getBookingByReference(reference: string): Promise<Booking | null>;
    static createBooking(data: CreateBookingData): Promise<Booking>;
    static updateBooking(id: string, updates: Partial<Booking>): Promise<Booking>;
    static cancelBooking(id: string, cancelledBy: string): Promise<Booking>;
    static getAvailableRooms(roomTypeId: number, checkIn: string, checkOut: string): Promise<any[]>;
}
export default BookingService;
//# sourceMappingURL=BookingService.d.ts.map