'use client'

import type { TableStatus } from '@/types/tables'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, Lock, AlertTriangle } from 'lucide-react'

interface TableFiltersProps {
  activeFilter: TableStatus | 'all'
  onFilterChange: (filter: TableStatus | 'all') => void
  counts: {
    all: number
    Opening: number
    Locked: number
    Booked: number
    Closing: number
  }
}

export function TableFilters({ activeFilter, onFilterChange, counts }: TableFiltersProps) {
  const filters = [
    { value: 'all', label: 'Tất cả', icon: null, color: 'bg-gray-100' },
    { value: 'Opening', label: 'Trống', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { value: 'Locked', label: 'Đã khóa', icon: Lock, color: 'bg-amber-100 text-amber-700' },
    { value: 'Booked', label: 'Đã đặt trước', icon: Clock, color: 'bg-blue-100 text-blue-700' },
    { value: 'Closing', label: 'Đã đóng', icon: AlertTriangle, color: 'bg-red-100 text-red-700' }
  ]

  return (
    <Card className='p-3 grid grid-cols-2 sm:grid-cols-5 gap-2'>
      {filters.map((filter) => {
        const Icon = filter.icon
        return (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'green' : 'outline'}
            size='sm'
            className='justify-between h-auto py-3'
            onClick={() => onFilterChange(filter.value as TableStatus | 'all')}
          >
            <div className='flex items-center'>
              {Icon && <Icon className='mr-2 h-4 w-4' />}
              <span>{filter.label}</span>
            </div>
            <Badge variant={activeFilter === filter.value ? 'secondary' : 'outline'} className='ml-2'>
              {counts[filter.value as keyof typeof counts]}
            </Badge>
          </Button>
        )
      })}
    </Card>
  )
}
