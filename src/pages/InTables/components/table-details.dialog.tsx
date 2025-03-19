'use client'

import { useState } from 'react'
import { Users, MapPin, Clock, Printer, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type TableResponse from '@/types/tables'
import { getStatusBadge, getStatusIcon } from '@/utils/table-utils'
import useZone from '@/hooks/useZone'
import { getZoneName } from '@/utils/zone-utils'
import { TableTimer } from './table-timer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent } from '@/components/ui/card'

interface TableDetailsDialogProps {
  table: TableResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableDetailsDialog({ table, open, onOpenChange }: TableDetailsDialogProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [qrSize, setQrSize] = useState<'small' | 'medium' | 'large'>('medium')
  const { zones_ } = useZone()

  const apiPublic = import.meta.env.VITE_PUBLIC_WEBSITE_URL || 'https://example.com'
  const qrCodeData = `${apiPublic}/${table.id}/?tableCode=${table.code}`

  const getQrSize = () => {
    switch (qrSize) {
      case 'small':
        return 150
      case 'large':
        return 300
      default:
        return 200
    }
  }
  const handleOpenTable = () => {
    return () => {
      console.log(`Mở bàn ${table.id}`)
    }
  }

  const handleCloseTable = () => {
    return () => {
      console.log(`Khóa bàn ${table.id}`)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>In mã QR - ${table.code}</title>
            <style>
              body { 
                font-family: system-ui, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { 
                margin: 0 auto; 
                max-width: 400px; 
              }
              .table-info { margin-top: 20px; }
              .table-name { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 5px; 
              }
              .table-id { 
                font-size: 14px; 
                color: #666; 
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}" />
              <div class="table-info">
                <div class="table-name">${table.code}</div>
                <div class="table-id">ID: ${table.id}</div>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-code-area svg') as SVGElement
    if (!canvas) return

    const svgData = new XMLSerializer().serializeToString(canvas)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = `qr-code-${table.code}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  // Function to get action buttons based on table status
  const getActionButtons = (table: TableResponse) => {
    switch (table.status) {
      case 'Closing':
        return (
          <>
            <Button onClick={handleOpenTable()} variant='green' className='flex-1'>
              Mở bàn
            </Button>
            <Button variant='outline' className='flex-1'>
              Đặt trước
            </Button>
          </>
        )
      case 'Opening':
        return (
          <>
            <Button variant='destructive' onClick={handleCloseTable()} className='flex-1'>
              Khóa bàn
            </Button>
            <Button variant='yellow' className='flex-1'>
              Bảo trì
            </Button>
          </>
        )
      case 'Booked':
        return (
          <>
            <Button className='flex-1'>Xác nhận</Button>
            <Button variant='outline' className='flex-1'>
              Hủy đặt
            </Button>
          </>
        )
      case 'Locked':
        return <Button className='flex-1'>Mở khóa</Button>
      default:
        return null
    }
  }

  const handleTimeUp = () => {
    setIsTimerRunning(false)
    console.log(`Hết thời gian cho bàn ${table.id}`)
  }

  const getStatusInfo = () => {
    switch (table.status) {
      case 'Closing':
        return {
          title: 'Thông tin bàn đang đóng',
          content: (
            <div className='space-y-2'>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Trạng thái:</span>
                <span className='text-sm font-medium'>Bàn đã đóng</span>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Thời gian đóng:</span>
                <span className='text-sm font-medium'>{new Date().toLocaleString('vi-VN')}</span>
              </div>
            </div>
          )
        }
      case 'Booked':
        return {
          title: 'Thông tin đặt trước',
          content: (
            <div className='space-y-2'>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Khách hàng:</span>
                <span className='text-sm font-medium'>{table.id}</span>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Thời gian còn lại:</span>
                <TableTimer isRunning={isTimerRunning} onTimeUp={handleTimeUp} />
              </div>
            </div>
          )
        }
      case 'Locked':
        return {
          title: 'Thông tin bảo trì',
          content: (
            <div className='space-y-2'>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-sm text-muted-foreground'>Ghi chú:</span>
                <span className='text-sm font-medium'>{table.code}</span>
              </div>
            </div>
          )
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <div className='text-xl'>{table.code}</div>
              {table.code && (
                <Badge variant='outline' className='border-amber-500 text-amber-500'>
                  VIP
                </Badge>
              )}
            </div>
            <div className='ml-auto'>{getStatusBadge(table.status)}</div>
          </DialogTitle>
          <DialogDescription>Chi tiết thông tin bàn ăn</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='details'>Chi tiết</TabsTrigger>
            <TabsTrigger value='qrcode'>Mã QR</TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-4 py-4'>
            <Card>
              <CardContent className='p-4 space-y-4'>
                <div className='grid grid-cols-[24px_1fr] items-start gap-3'>
                  <Users className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='font-medium'>Sức chứa</p>
                    <p className='text-sm text-muted-foreground'>{table.capacity} người</p>
                  </div>
                </div>

                <div className='grid grid-cols-[24px_1fr] items-start gap-3'>
                  <MapPin className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='font-medium'>Vị trí</p>
                    <p className='text-sm text-muted-foreground'>{getZoneName(table.zoneId, zones_)}</p>
                  </div>
                </div>

                <div className='grid grid-cols-[24px_1fr] items-start gap-3'>
                  <Clock className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='font-medium'>Cập nhật lần cuối</p>
                    <p className='text-sm text-muted-foreground'>{new Date().toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {statusInfo && (
              <Card>
                <CardContent className='p-4'>
                  <div className=' items-start gap-3'>
                    {getStatusIcon(table.status)}
                    <div className='space-y-3'>
                      <h3 className='font-medium'>{statusInfo.title}</h3>
                      {statusInfo.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='qrcode' className='py-4'>
            <Card>
              <CardContent className='p-6 space-y-6'>
                <div className='flex flex-col items-center justify-center'>
                  <div className='text-center' id='qr-code-area'>
                    <QRCodeSVG
                      value={qrCodeData}
                      size={getQrSize()}
                      level='H'
                      includeMargin={true}
                      className='rounded-md'
                    />
                    <p className='mt-4 font-semibold text-lg'>{table.code}</p>
                    <p className='text-sm text-muted-foreground'>ID: {table.id}</p>
                  </div>
                </div>

                <Separator />

                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium mb-2'>Kích thước mã QR</h3>
                    <div className='flex gap-2'>
                      <Button
                        variant={qrSize === 'small' ? 'default' : 'outline'}
                        onClick={() => setQrSize('small')}
                        className='flex-1'
                      >
                        Nhỏ
                      </Button>
                      <Button
                        variant={qrSize === 'medium' ? 'default' : 'outline'}
                        onClick={() => setQrSize('medium')}
                        className='flex-1'
                      >
                        Vừa
                      </Button>
                      <Button
                        variant={qrSize === 'large' ? 'default' : 'outline'}
                        onClick={() => setQrSize('large')}
                        className='flex-1'
                      >
                        Lớn
                      </Button>
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <Button onClick={handlePrint} className='flex-1'>
                      <Printer className='mr-2 h-4 w-4' />
                      In mã QR
                    </Button>
                    <Button variant='outline' onClick={handleDownload} className='flex-1'>
                      <Download className='mr-2 h-4 w-4' />
                      Tải xuống SVG
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className='flex flex-col sm:flex-row gap-2'>
          <div className='flex gap-2 w-full sm:w-auto'>{getActionButtons(table)}</div>
          <Button variant='outline' onClick={() => onOpenChange(false)} className='w-full sm:w-auto'>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
