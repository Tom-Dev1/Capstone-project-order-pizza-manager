'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { OrderItem } from '@/types/order'
import { Clock, CheckCircle2, Ban, Receipt, Calendar, Table2 } from 'lucide-react'

interface OrderDetailsDialogProps {
  orderItems: OrderItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ orderItems, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!orderItems.length) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Serving':
        return (
          <Badge variant='outline' className='bg-green-50 text-green-600 border-green-200 flex items-center gap-1'>
            <CheckCircle2 className='h-3 w-3' />
            Đang phục vụ
          </Badge>
        )
      case 'Pending':
        return (
          <Badge variant='outline' className='bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            Đang chờ
          </Badge>
        )
      case 'Cancelled':
        return (
          <Badge variant='outline' className='bg-red-50 text-red-600 border-red-200 flex items-center gap-1'>
            <Ban className='h-3 w-3' />
            Đã hủy
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  // Fix the totalAmount calculation to handle null/undefined values
  const totalAmount = orderItems.reduce((sum, item) => {
    // Check if totalPrice exists and is a number
    const itemPrice = item.totalPrice || 0
    return sum + itemPrice
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[800px] h-[90vh] flex flex-col'>
        <DialogHeader className='pb-4'>
          <DialogTitle className='text-2xl flex items-center gap-2'>Chi tiết đơn hàng</DialogTitle>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
            <div className='flex items-center gap-2'>
              <Table2 className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Bàn</p>
                <p className='text-sm text-muted-foreground'>{orderItems[0]?.tableCode}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Receipt className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Mã đơn</p>
                <p className='text-sm text-muted-foreground'>{orderItems[0]?.orderId.slice(0, 8)}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Thời gian</p>
                <p className='text-sm text-muted-foreground'>{formatDate(orderItems[0]?.startTime)}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className='flex-1 pr-4'>
          <div className='space-y-6 py-4'>
            {orderItems.map((item) => (
              <div key={item.id} className='rounded-lg border p-4 transition-colors hover:bg-muted/50'>
                <div className='flex justify-between items-start mb-2'>
                  <div className='space-y-1'>
                    <h4 className='font-medium'>{item.name}</h4>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <span>Số lượng: {item.quantity}</span>
                      <span>•</span>
                      <span>{item.price ? item.price.toLocaleString('vi-VN') : 'N/A'} ₫/món</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-lg'>
                      {item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') : 'N/A'} ₫
                    </p>
                    {getStatusBadge(item.orderItemStatus)}
                  </div>
                </div>
                {item.note && item.note !== 'No Comment' && (
                  <div className='mt-2 text-sm'>
                    <span className='font-medium'>Ghi chú:</span>
                    <span className='text-muted-foreground ml-1'>{item.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className='my-4' />

        <div className='px-4 py-2 bg-muted/50 rounded-lg'>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-muted-foreground'>Tổng số món</p>
              <p className='font-medium'>{orderItems.length} món</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Tổng tiền</p>
              <p className='text-xl font-bold text-primary'>
                {totalAmount ? totalAmount.toLocaleString('vi-VN') : 'N/A'} ₫
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className='mt-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button>Thanh toán</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
