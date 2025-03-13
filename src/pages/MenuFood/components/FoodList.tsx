'use client'

import React from 'react'
import { MoreVertical, Edit, Trash2, Filter, ArrowUpDown } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// import { EditFoodDialog } from './edit-food-dialog'
// import { DeleteFoodDialog } from './delete-food-dialog'
import useProducts from '@/hooks/useProducts'

const FoodList: React.FC = () => {
  //   const [editingFood, setEditingFood] = useState<ProductModel | null>(null)
  //   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  //   const [isDeletingFood, setIsDeletingFood] = useState<ProductModel | null>(null)
  //   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { products } = useProducts()

  //   const handleEdit = (food: ProductModel) => {
  //     setEditingFood(food)
  //     setIsEditDialogOpen(true)
  //   }

  //   const handleDelete = (food: ProductModel) => {
  //     setIsDeletingFood(food)
  //     setIsDeleteDialogOpen(true)
  //   }

  //   const confirmDelete = () => {
  //     if (isDeletingFood) {
  //       setFoods(products.filter((food) => food.id !== isDeletingFood.id))
  //       setIsDeleteDialogOpen(false)
  //       setIsDeletingFood(null)
  //     }
  //   }

  //   const updateFood = (updatedFood: ProductModel) => {
  //     setFoods(foods.map((food) => (food.id === updatedFood.id ? updatedFood : food)))
  //     setIsEditDialogOpen(false)
  //     setEditingFood(null)
  //   }

  const getProductTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return 'Món chính'
      case 2:
        return 'Tráng miệng'
      case 3:
        return 'Đồ uống'
      default:
        return 'Khác'
    }
  }
  console.log(products)

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Danh sách món ăn</h2>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm' className='gap-2'>
            <Filter className='h-4 w-4' />
            Lọc
          </Button>
          <Select defaultValue='newest'>
            <SelectTrigger className='w-[180px]'>
              <div className='flex items-center gap-2'>
                <ArrowUpDown className='h-4 w-4' />
                <SelectValue placeholder='Sắp xếp' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Mới nhất</SelectItem>
              <SelectItem value='price-asc'>Giá: Thấp đến cao</SelectItem>
              <SelectItem value='price-desc'>Giá: Cao đến thấp</SelectItem>
              <SelectItem value='name-asc'>Tên: A-Z</SelectItem>
              <SelectItem value='name-desc'>Tên: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {products.map((food) => (
          <Card key={food.id} className='overflow-hidden h-full'>
            <div className='w-full '>
              <img
                src={
                  food.image ||
                  'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F20200001_2.jpg&w=1920&q=75'
                }
                alt={food.name}
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='font-semibold text-lg'>{food.name}kaka</h3>
                  <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{food.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Edit className='h-4 w-4 mr-2' />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-destructive focus:text-destructive'>
                      <Trash2 className='h-4 w-4 mr-2' />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className='flex items-center gap-2 mt-3'>
                <Badge variant='outline'>{food.categoryId}</Badge>
                <Badge variant='secondary'>{getProductTypeLabel(food.productType)}</Badge>
              </div>
            </CardContent>
            <CardFooter className='p-4 pt-0 flex justify-between items-center'>
              <span className='font-semibold text-primary'>{food.price.toLocaleString('vi-VN')} ₫</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* {editingFood && (
        <EditFoodDialog
          food={editingFood}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={updateFood}
        />
      )}

      <DeleteFoodDialog
        food={isDeletingFood}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      /> */}
    </div>
  )
}
export default FoodList
