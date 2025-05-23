import ApiResponse, { get, post, put } from "@/apis/apiUtils"
import { CreateBookingData, ReservationsResult } from "@/types/reservation"

export type ApiErrorResponse = {
    error: {
        code: number
        message: string
        statusCode: number
        timestamp: string
        title: string
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type assignTableResult = any



export default class BookingService {
    private static instance: BookingService

    private constructor() { }

    public static getInstance(): BookingService {
        if (!BookingService.instance) {
            BookingService.instance = new BookingService()
        }
        return BookingService.instance
    }
    public async getAllReservations(): Promise<ApiResponse<ReservationsResult>> {
        try {
            console.log(`Calling getAllReservations API`)

            // Add pagination parameters to the API call
            const response = await get<ReservationsResult>(`/reservations?TakeCount=1000&IncludeProperties=TableAssignReservations`)

            console.log(`API response for reservations `, response)
            return response
        } catch (error) {
            console.error(`Error fetching reservations:`, error)
            throw error
        }
    }
    public async updateReservation(
        id: string,
        data: {
            id: string
            bookingDate: string
            guestCount: number
        },
    ): Promise<ApiResponse<void>> {
        try {
            console.log(`Updating reservation ${id} with data:`, data)
            const response = await put<void>(`/reservations/${id}`, data)
            console.log("Update reservation response:", response)
            return response
        } catch (error) {
            console.error(`Error updating reservation ${id}:`, error)
            throw error
        }
    }
    /**
     * Confirm a reservation
     * @param id The ID of the reservation to confirm
     * @returns Promise with the confirmation result
     */
    public async confirmReservation(id: string): Promise<ApiResponse<void>> {
        try {
            console.log(`Confirming reservation ${id}`)
            const response = await get<void>(`/reservations/confirm?ReservationId=${id}`)
            console.log("Confirm reservation response:", response)
            return response
        } catch (error) {
            console.error(`Error confirming reservation ${id}:`, error)
            throw error
        }
    }

    /**
     * Cancel a reservation
     * @param id The ID of the reservation to cancel
     * @returns Promise with the cancellation result
     */
    public async cancelReservation(id: string): Promise<ApiResponse<void>> {
        try {
            console.log(`Cancelling reservation ${id}`)
            const response = await get<void>(`/reservations/cancel?ReservationId=${id}`)
            console.log("Cancel reservation response:", response)
            return response
        } catch (error) {
            console.error(`Error cancelling reservation ${id}:`, error)
            throw error
        }
    }
    /**
     * Assign one or more tables to a reservation
     * @param reservationId The ID of the reservation
     * @param tableId A single table ID or an array of table IDs
     * @returns Promise with the assignment result
     */
    public async assignTableToReservation(reservationId: string, tableId: string | string[]): Promise<ApiResponse<void>> {
        try {
            // Convert single tableId to array if needed
            const tableIdArray = Array.isArray(tableId) ? tableId : [tableId]

            const data = {
                reservationId,
                tableId: tableIdArray,
            }
            return await post<void>(`/reservations/assign-table-reservation`, data)
        } catch (error) {
            console.error(`Error assigning tables to reservation ${reservationId}:`, error)
            throw error
        }
    }
    public async cancelAssignTableToReservation(reservationId: string, tableId: string | string[]): Promise<ApiResponse<void>> {
        try {
            // Convert single tableId to array if needed
            const tableIdArray = Array.isArray(tableId) ? tableId : [tableId]

            const data = {
                reservationId,
                tableId: tableIdArray,
            }
            return await post<void>(`/reservations/unassign-table-reservation`, data)
        } catch (error) {
            console.error(`Error assigning tables to reservation ${reservationId}:`, error)
            throw error
        }
    }
    public async checkInReservation(reservationId: string): Promise<ApiResponse<void>> {
        try {
            const res = { reservationId }
            const response = await put<void>(`/reservations/check-in`, res)
            console.log("Check-in reservation response:", response)
            return response
        } catch (error) {
            console.error(`Error checking in reservation ${reservationId}:`, error)
            throw error
        }
    }
    public async createBooking(data: CreateBookingData): Promise<ApiResponse<void>> {
        try {
            console.log("Creating new booking with data:", data)
            const response = await post<void>("/reservations/create-reservation-by-manager", data)
            console.log("Create booking response:", response)
            return response
        } catch (error) {
            console.error("Error creating booking:", error)
            throw error
        }
    }


}
