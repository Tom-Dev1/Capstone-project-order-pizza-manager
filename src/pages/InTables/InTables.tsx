import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type React from 'react'
import { useState } from 'react'
import TableManagement from './table-management'
import ZoneManagement from './zone-management'
import { LayoutGrid, ListFilter } from 'lucide-react'

const InTables: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tables')

  return (
    <div className='mx-auto p-4 max-w-full'>
      <h1 className='text-2xl font-bold mb-6'>Quản lý nhà hàng</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
        <div className='flex items-center justify-between'>
          <TabsList className='grid w-full max-w-md grid-cols-2'>
            <TabsTrigger value='tables' className='flex items-center gap-2'>
              <LayoutGrid className='h-4 w-4' />
              <span>Quản lý bàn ăn</span>
            </TabsTrigger>
            <TabsTrigger value='zones' className='flex items-center gap-2'>
              <ListFilter className='h-4 w-4' />
              <span>Quản lý khu vực</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='tables' className='w-full'>
          <TableManagement />
        </TabsContent>
        <TabsContent value='zones' className='w-full'>
          <ZoneManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InTables
