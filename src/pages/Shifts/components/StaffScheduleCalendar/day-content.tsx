import { Badge } from '@/components/ui/badge'
import { Users, AlertCircle, ArrowRightLeft } from 'lucide-react'
import type { StaffSchedule, WorkingSlotRegister, SwapWorkingSlotRequest } from '@/types/staff-schedule'

interface DayContentProps {
  date: Date
  schedules: StaffSchedule[]
  registrations: WorkingSlotRegister[]
  swapRequests: SwapWorkingSlotRequest[]
}

export function DayContent({ date, schedules, registrations, swapRequests }: DayContentProps) {
  console.log(date)

  // Only count registrations that are pending or approved without a zone
  const pendingRegistrations = registrations.filter(
    (reg) => reg.status === 'Onhold' || (reg.status === 'Approved' && reg.zoneId === null)
  )
  const pendingSwapRequests = swapRequests.filter((req) => req.status === 'PendingManagerApprove')

  const hasSchedules = schedules.length > 0
  const hasPendingItems = pendingRegistrations.length > 0 || pendingSwapRequests.length > 0

  return (
    <div className='space-y-2'>
      {hasSchedules && (
        <Badge className='bg-red-100 text-red-800 border border-red-300 flex items-center gap-1'>
          <Users className='h-3.5 w-3.5' />
          <span>{schedules.length}</span>
        </Badge>
      )}

      {pendingRegistrations.length > 0 && (
        <Badge className='bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1'>
          <AlertCircle className='h-3.5 w-3.5' />
          <span>{pendingRegistrations.length}</span>
        </Badge>
      )}

      {pendingSwapRequests.length > 0 && (
        <Badge className='bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1'>
          <ArrowRightLeft className='h-3.5 w-3.5' />
          <span>{pendingSwapRequests.length}</span>
        </Badge>
      )}

      {!hasSchedules && !hasPendingItems && <div className='text-xs text-gray-500'>Không có dữ liệu</div>}
    </div>
  )
}
