import { connection } from '@/lib/signalr-client'
import { useEffect } from 'react'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
let isConnected = false

type Notification = {
  id: number
  type: number
  title: string
  message: string
  payload: string
  createdAt: string
}
type ReservationCreatedNotification = {
  numberOfPeople: number
  customerName: string
  phoneNumber: string
  id: string
}
export default function SignalRListener() {
  useEffect(() => {
    if (!isConnected && connection.state === 'Disconnected') {
      isConnected = true
      connection
        .start()
        .then(() => console.log('✅ Connected to SignalR'))
        .catch((err) => {
          isConnected = false
          console.error('❌ Connect fail:', err)
        })
    }

    connection.on('ReceiveNotification', (data: Notification) => {
      Swal.fire({
        title: data.title,
        text: data.message,
        width: '32em', // Increased width
        confirmButtonText: 'Đóng',
        customClass: {
          title: 'text-xl font-bold',
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
          htmlContainer: 'text-base'
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      })
    })


    // connection.on('ReservationCreated', (data: ReservationCreatedNotification) => {
    //   console.log('Received ReservationCreated notification:', data)

    //   Swal.fire({
    //     title: 'Đặt bàn',
    //     text:
    //       'Bạn có một đặt bàn mới từ ' +
    //       data.customerName +
    //       ' với số lượng người là ' +
    //       data.numberOfPeople +
    //       ' và số điện thoại là ' +
    //       data.phoneNumber,
    //     icon: 'success',
    //     width: '32em',
    //     confirmButtonText: 'Đóng',
    //     customClass: {
    //       title: 'text-xl font-bold',
    //       popup: `
    //         animate__animated
    //         animate__fadeInUp
    //         animate__faster
    //       `,
    //       htmlContainer: 'text-base'
    //     },
    //     hideClass: {
    //       popup: `
    //         animate__animated
    //         animate__fadeOutDown
    //         animate__faster
    //       `
    //     }
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       window.location.href = '/in-tables'
    //     }
    //   })
    // })
    connection.on('ReservationCreated', (data: ReservationCreatedNotification) => {
      console.log('Received ReservationCreated notification:', data)
      toast.custom((t) => (

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-5 w-[32em] border-l-4 border-green-500"
        >
          <div className="text-xl font-bold text-green-700 mb-2">Đặt bàn</div>
          <div className="text-base text-gray-800">
            Bạn có một đặt bàn mới từ <strong>{data.customerName}</strong> với số lượng người là{' '}
            <strong>{data.numberOfPeople}</strong> và số điện thoại là <strong>{data.phoneNumber}</strong>.
          </div>
          <div className="text-right mt-4">
            <button
              onClick={() => {
                toast.dismiss(t)
                window.location.href = '/in-tables'
              }}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      ),
        { duration: 10000 }
      )
    })







    connection.on('AssignTableForReservation', (data: ReservationCreatedNotification) => {
      console.log('Received AssignTableForReservation notification:', data)

      Swal.fire({
        title: 'Sắp xếp bàn',
        text:
          'Sắp có khách ' +
          data.customerName +
          ' với số lượng người là ' +
          data.numberOfPeople +
          ' và số điện thoại là ' +
          data.phoneNumber +
          ' đến, vui lòng chọn bàn cho khách',
        icon: 'success',
        width: '32em',
        confirmButtonText: 'Đóng',
        customClass: {
          title: 'text-xl font-bold',
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
          htmlContainer: 'text-base'
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/in-tables'
        }
      })
    })



    connection.on('OrderItemUpdatedStatus', () => { })

    return () => {
      connection.off('OrderItemUpdatedStatus')
      connection.off('AssignTableForReservation')
      connection.off('ReceiveNotification')
      connection.off('ReservationCreated')
    }
  }, [])

  return null
}
