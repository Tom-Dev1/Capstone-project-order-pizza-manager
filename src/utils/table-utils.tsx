import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Calendar, Coffee } from 'lucide-react'

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Opening':
      return <Badge className='px-3 bg-green-500 hover:bg-green-600 h-[32px] text-base'>Bàn có khách</Badge>
    case 'Closing':
      return <Badge className='px-3 bg-red-500 hover:bg-red-600 h-[32px] text-base'>Bàn đang đóng</Badge>
    case 'Booked':
      return <Badge className='px-3 bg-blue-500 hover:bg-blue-600 h-[32px] text-base'>Đã đặt trước</Badge>
    case 'Locked':
      return <Badge className='px-3 bg-yellow-500 hover:bg-yellow-600 h-[32px] text-base'>Đang bảo trì</Badge>
    default:
      return <Badge variant='outline'>Không xác định</Badge>
  }
}
export const getStatusZone = (status: number) => {
  switch (status) {
    case 0:
      return <Badge className='px-3 bg-green-500 hover:bg-green-600  text-xs'>Hoạt động</Badge>
    case 1:
      return <Badge className='px-3 bg-red-500 hover:bg-red-600 text-xs'>Đóng</Badge>
    case 2:
      return <Badge className='px-3 bg-blue-500 hover:bg-blue-600 text-xs'>Đã đặt trước</Badge>
    case 3:
      return <Badge className='px-3 bg-yellow-500 hover:bg-yellow-600 text-xs'>Đang bảo trì</Badge>
    default:
      return <Badge variant='outline'>Không xác định</Badge>
  }
}
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Opening':
      return <Coffee className='h-4 w-4 text-green-500' />
    case 'Closed':
      return <AlertTriangle className='h-4 w-4 text-red-500' />
    case 'Booked':
      return <Calendar className='h-4 w-4 text-blue-500' />
    case 'Locked':
      return <AlertTriangle className='h-4 w-4 text-yellow-500' />
    default:
      return null
  }
}
