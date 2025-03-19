'use client'

import useTable from '@/hooks/useTable'
import type { TableStatus } from '@/types/tables'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/search-bar'
import { Filter, Plus, RefreshCw } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { TableFilters } from './components/table-filters'
import { TableList } from './components/table-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TableAddDialog } from './components/table-add-dialog'

const TableManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<TableStatus | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const { tables, loading, fetchAllTables } = useTable()

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.zoneId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === 'all' || table.status === activeFilter

    return matchesSearch && matchesFilter
  })

  const handleCreateTable = () => {
    setShowAddDialog(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await fetchAllTables()
    } finally {
      setIsLoading(false)
    }
  }

  const handleTableUpdated = () => {
    // Refresh the table list after a table is updated
    fetchAllTables()
  }

  const tableStatusCounts = {
    all: tables.length,
    Opening: tables.filter((t) => t.status === 'Opening').length,
    Locked: tables.filter((t) => t.status === 'Locked').length,
    Booked: tables.filter((t) => t.status === 'Booked').length,
    Closing: tables.filter((t) => t.status === 'Closing').length
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Quản lý bàn ăn</CardTitle>
            <CardDescription>Quản lý tất cả các bàn trong nhà hàng</CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-sm'>
              Tổng số: {tables.length} bàn
            </Badge>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={handleRefresh}
              disabled={isLoading || loading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <SearchBar placeholder='Tìm kiếm bàn, khu vực...' value={searchQuery} onChange={setSearchQuery} />
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <Button
              variant={showFilters ? 'outline' : 'outline'}
              size='sm'
              className='h-9 px-3 flex-1 sm:flex-none'
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className='h-4 w-4 mr-2' />
              Bộ lọc
              {activeFilter !== 'all' && (
                <Badge className='ml-2 bg-primary-foreground text-primary'>{tableStatusCounts[activeFilter]}</Badge>
              )}
            </Button>
            <Button onClick={handleCreateTable} variant='green' size='sm' className='h-9 flex-1 sm:flex-none'>
              <Plus className='mr-2 h-4 w-4' />
              Thêm bàn mới
            </Button>
          </div>
        </div>

        {showFilters && (
          <TableFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={tableStatusCounts} />
        )}

        <TableList tables={filteredTables} onTableUpdated={handleTableUpdated} />

        {filteredTables.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-muted-foreground'>Không tìm thấy bàn nào phù hợp với bộ lọc</p>
            <Button
              variant='link'
              onClick={() => {
                setActiveFilter('all')
                setSearchQuery('')
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}

        <TableAddDialog open={showAddDialog} onOpenChange={setShowAddDialog} onTableAdded={handleTableUpdated} />
      </CardContent>
    </Card>
  )
}

export default TableManagement
