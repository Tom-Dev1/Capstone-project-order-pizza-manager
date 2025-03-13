import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddFoodDialog } from './AddFoodDialog'

export function MenuFoodHeader() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <header className='border-b justify-end flex'>
      <Button onClick={() => setIsAddDialogOpen(true)} className='gap-2 bg-green-500 px-2'>
        <PlusCircle className='h-4 w-4' />
        Thêm món ăn
      </Button>
      <AddFoodDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </header>
  )
}
