import { Users, MoreVertical, QrCode, Edit, History, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type TableResponse from '@/types/tables'
import { useState } from 'react'
import { TableDetailsDialog } from './table-details.dialog'
import useZone from '@/hooks/useZone'
import { getStatusBadge, getStatusIcon } from '@/utils/table-utils'
import { getZoneName } from '@/utils/zone-utils'
import { TableTimer } from './table-timer'
import { Badge } from '@/components/ui/badge'
import api from '@/apis/axiosConfig'
import { toast } from 'sonner'

interface TableListProps {
  tables: TableResponse[]
  onTableUpdated?: () => void // Callback to refresh tables after update
}

export function TableList({ tables, onTableUpdated }: TableListProps) {
  const [selectedTable, setSelectedTable] = useState<TableResponse | null>()
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [runningTimers, setRunningTimers] = useState<{ [key: string]: boolean }>({})
  const [loadingTableIds, setLoadingTableIds] = useState<string[]>([]) // Track which tables are being updated
  const { zones_ } = useZone()

  const handleTimeUp = (tableId: string) => {
    setRunningTimers((prev) => ({ ...prev, [tableId]: false }))
    console.log(`Hết thời gian cho bàn ${tableId}`)
  }

  const handleOpenTable = async (tableId: string) => {
    setLoadingTableIds((prev) => [...prev, tableId]) // Set loading state for this table
    try {
      await api.put(`/tables/open-table/${tableId}`)
      toast.success('Bàn đã được mở')

      // Call the callback to refresh table data
      if (onTableUpdated) {
        onTableUpdated()
      }
    } catch (error) {
      console.error(`Lỗi khi mở bàn với ID: ${tableId}`, error)
      toast.error('Không thể mở bàn. Vui lòng thử lại.')
    } finally {
      setLoadingTableIds((prev) => prev.filter((id) => id !== tableId)) // Remove loading state
    }
  }

  const handleCloseTable = async (tableId: string) => {
    setLoadingTableIds((prev) => [...prev, tableId]) // Set loading state for this table
    try {
      await api.put(`/tables/close-table/${tableId}`)
      toast.success('Bàn đã được đóng')

      // Call the callback to refresh table data
      if (onTableUpdated) {
        onTableUpdated()
      }
    } catch (error) {
      console.error(`Lỗi khi đóng bàn với ID: ${tableId}`, error)
      toast.error('Không thể đóng bàn. Vui lòng thử lại.')
    } finally {
      setLoadingTableIds((prev) => prev.filter((id) => id !== tableId)) // Remove loading state
    }
  }

  // Function to get action buttons based on table status
  const getActionButtons = (table: TableResponse) => {
    const isLoading = loadingTableIds.includes(table.id)

    switch (table.status) {
      case 'Closing':
        return (
          <div className='flex gap-2 mt-3'>
            <Button
              onClick={() => handleOpenTable(table.id)}
              variant='outline'
              size='sm'
              className='flex-1'
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Mở bàn'}
            </Button>
            <Button variant='outline' size='sm' className='flex-1' disabled={isLoading}>
              Đặt trước
            </Button>
          </div>
        )
      case 'Opening':
        return (
          <div className='flex gap-2 mt-3'>
            <Button
              onClick={() => handleCloseTable(table.id)}
              variant='outline'
              size='sm'
              className='flex-1'
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đóng bàn'}
            </Button>
            <Button variant='outline' size='sm' className='flex-1' disabled={isLoading}>
              Bảo trì
            </Button>
          </div>
        )
      case 'Booked':
        return (
          <div className='flex gap-2 mt-3'>
            <Button size='sm' className='flex-1' disabled={isLoading}>
              Xác nhận
            </Button>
            <Button variant='outline' size='sm' className='flex-1' disabled={isLoading}>
              Hủy đặt
            </Button>
          </div>
        )
      case 'Locked':
        return (
          <div className='flex gap-2 mt-3'>
            <Button onClick={() => handleOpenTable(table.id)} size='sm' className='flex-1' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Mở khóa'}
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const handleOpenDetails = (table: TableResponse) => {
    setSelectedTable(table)
    setShowDetailsDialog(true)
  }

  return (
    <>
      {tables.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-muted-foreground'>Không có bàn nào</p>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {tables.map((table) => (
            <Card key={table.id} className='overflow-hidden hover:shadow-md transition-shadow'>
              <CardContent className='p-0'>
                <div
                  className={`flex items-center justify-between border-b p-4 bg-${table.status === 'Opening' ? 'green' : table.status === 'Booked' ? 'blue' : table.status === 'Closing' ? 'red' : table.status === 'Locked' ? 'amber' : 'gray'}-100`}
                >
                  <div className='flex items-center space-x-5'>
                    <h3 className='font-medium text-3xl'>{table.code}</h3>
                    <div> {getStatusBadge(table.status)}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreVertical className='h-4 w-4' />
                        <span className='sr-only'>Tùy chọn</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleOpenDetails(table)} className='flex items-center'>
                        <Eye className='mr-2 h-4 w-4' />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDetails(table)} className='flex items-center'>
                        <Edit className='mr-2 h-4 w-4' />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDetails(table)} className='flex items-center'>
                        <History className='mr-2 h-4 w-4' />
                        Lịch sử
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDetails(table)} className='flex items-center'>
                        <QrCode className='mr-2 h-4 w-4' />
                        Mã QR
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className='p-4'>
                  <div className=' h-[100px]'>
                    <div className='flex items-center text-sm'>
                      <Users className='mr-2 h-4 w-4 text-muted-foreground' />
                      <span>
                        Sức chứa:{' '}
                        <Badge variant='outline' className='ml-1'>
                          {table.capacity} người
                        </Badge>
                      </span>
                    </div>
                    <div className='flex mt-3 items-center text-sm'>
                      <span className='mr-2'>📍</span>
                      <span>{getZoneName(table.zoneId, zones_)}</span>
                    </div>

                    {table.status === 'Opening' && table.currentOrderId && (
                      <div className='mt-1 flex items-center text-sm'>
                        {getStatusIcon(table.status)}
                        <span className='ml-1 font-medium text-green-600'>Đơn hàng: {table.currentOrderId}</span>
                      </div>
                    )}

                    {table.status === 'Booked' && (
                      <div className='mt-1 flex items-center text-sm'>
                        {getStatusIcon(table.status)}
                        <div className='ml-auto'>
                          <TableTimer
                            isRunning={runningTimers[table.id] || false}
                            onTimeUp={() => handleTimeUp(table.id)}
                          />
                        </div>
                      </div>
                    )}

                    {table.status === 'Closing' && (
                      <div className='mt-1 flex items-center text-sm'>{getStatusIcon(table.status)}</div>
                    )}

                    {table.status === 'Locked' && (
                      <div className='mt-1 flex items-center text-sm'>{getStatusIcon(table.status)}</div>
                    )}
                  </div>

                  {getActionButtons(table)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTable && (
        <TableDetailsDialog table={selectedTable} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />
      )}
    </>
  )
}
