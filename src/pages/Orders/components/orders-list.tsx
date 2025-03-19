import { useState } from 'react'
import { MoreHorizontal, Eye, Edit, Trash2, Clock, CheckCircle2, AlertCircle, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderDetailsDialog } from './order-details-dialog'
import { type OrderItem, PAYMENT_STATUS, type Order } from '@/types/order'
import useOrderService from '@/hooks/useOrderService'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]

export function OrdersList() {
  const { orders, getOrderById } = useOrderService()
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  // const [isDeletingOrder, setIsDeletingOrder] = useState<Order | null>(null)
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'desc' })

  const filteredOrders = orders.filter(
    (order) =>
      order.tableCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortConfig.direction === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  // Paginate orders
  const totalPages = Math.ceil(sortedOrders.length / pageSize)
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (key: keyof Order) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleViewDetails = async (orderId: string) => {
    const response = await getOrderById(orderId)
    if (response?.success && response.result.items) {
      setSelectedOrderItems(response.result.items)
      setIsDetailsDialogOpen(true)
    }
  }

  // const handleDelete = (order: Order) => {
  //   setIsDeletingOrder(order)
  //   setIsDeleteDialogOpen(true)
  // }

  // const confirmDelete = () => {
  //   if (isDeletingOrder) {
  //     setOrders(orders.filter((order) => order.id !== isDeletingOrder.id))
  //     setIsDeleteDialogOpen(false)
  //     setIsDeletingOrder(null)
  //   }
  // }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return (
          <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-50 text-green-600'>
            <CheckCircle2 className='mr-1 h-3.5 w-3.5' />
            Đã thanh toán
          </div>
        )
      case PAYMENT_STATUS.CHECKOUT:
        return (
          <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-50 text-blue-600'>
            <Clock className='mr-1 h-3.5 w-3.5' />
            Đã checkout
          </div>
        )
      case PAYMENT_STATUS.UNPAID:
        return (
          <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-50 text-amber-600'>
            <AlertCircle className='mr-1 h-3.5 w-3.5' />
            Chưa thanh toán
          </div>
        )
      default:
        return (
          <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
            {status}
          </div>
        )
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold'>Danh sách đơn hàng</h2>
          <p className='text-sm text-muted-foreground'>Tổng số {filteredOrders.length} đơn hàng</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Tìm kiếm đơn hàng...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-[200px]'
            />
            <DropdownMenu>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Tất cả</DropdownMenuItem>
                <DropdownMenuItem>Chưa thanh toán</DropdownMenuItem>
                <DropdownMenuItem>Đã thanh toán</DropdownMenuItem>
                <DropdownMenuItem>Đã checkout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} dòng / trang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='w-[60px] text-center'>STT</TableHead>
              <TableHead className='w-[120px]'>
                <div className='flex items-center gap-2 '>Mã đơn</div>
              </TableHead>
              <TableHead>
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleSort('tableCode')}>
                  Bàn
                  <ArrowUpDown className='h-4 w-4' />
                </div>
              </TableHead>
              <TableHead>
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleSort('startTime')}>
                  Thời gian bắt đầu
                  <ArrowUpDown className='h-4 w-4' />
                </div>
              </TableHead>
              <TableHead>
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleSort('endTime')}>
                  Thời gian kết thúc
                  <ArrowUpDown className='h-4 w-4' />
                </div>
              </TableHead>
              <TableHead>
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleSort('totalPrice')}>
                  Tổng tiền
                  <ArrowUpDown className='h-4 w-4' />
                </div>
              </TableHead>
              <TableHead>
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleSort('status')}>
                  Trạng thái
                  <ArrowUpDown className='h-4 w-4' />
                </div>
              </TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order, index) => (
              <TableRow key={order.id} className='hover:bg-muted/50'>
                <TableCell className='text-center font-medium'>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                <TableCell className='font-medium'>{order.orderCode}</TableCell>
                <TableCell>{order.tableCode}</TableCell>
                <TableCell>{formatDate(order.startTime)}</TableCell>
                <TableCell>{formatDate(order.endTime)}</TableCell>
                <TableCell className='font-medium'>
                  {order.totalPrice ? order.totalPrice.toLocaleString('vi-VN') : 'N/A'} ₫
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                        <Eye className='h-4 w-4 mr-2' />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className='h-4 w-4 mr-2' />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='text-destructive focus:text-destructive'>
                        <Trash2 className='h-4 w-4 mr-2' />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Hiển thị {paginatedOrders.length} trên tổng số {filteredOrders.length} đơn hàng
        </p>
        <Pagination className='cursor-pointer'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size='default'
                onClick={currentPage === 1 ? undefined : () => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink size='default' onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                size='default'
                onClick={
                  currentPage === totalPages ? undefined : () => setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <OrderDetailsDialog
        orderItems={selectedOrderItems}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      {/* <DeleteOrderDialog
        order={isDeletingOrder}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      /> */}
    </div>
  )
}
