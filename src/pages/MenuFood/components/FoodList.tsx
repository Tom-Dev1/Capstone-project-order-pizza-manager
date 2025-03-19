'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash2, Filter, ArrowUpDown, Check, X } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

// import { DeleteFoodDialog } from './delete-food-dialog'
import useProducts from '@/hooks/useProducts'
import useCategories from '@/hooks/useCategories'
import type { ProductModel } from '@/types/product'
import { EditFoodDialog } from './edit-food-dialog'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

const FoodList: React.FC = () => {
  const [editingFood, setEditingFood] = useState<ProductModel | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  //   const [isDeletingFood, setIsDeletingFood] = useState<ProductModel | null>(null)
  //   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { products, loading } = useProducts()

  const { foodCategory } = useCategories()

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Apply filters and sorting whenever products, selectedCategory, or sortOption changes
  useEffect(() => {
    let result = [...products]

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) => product.categoryId === selectedCategory)
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // Assuming products are already sorted by newest first
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setDisplayedProducts(result)
  }, [products, selectedCategory, sortOption])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId)
    setIsFilterOpen(false)
  }

  const clearFilter = () => {
    setSelectedCategory('')
    setIsFilterOpen(false)
  }

  const getCategoryName = (categoryId: string) => {
    const category = foodCategory.find((cat) => cat.id === categoryId)
    return category ? category.name : 'Không xác định'
  }

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'newest':
        return 'Mới nhất'
      case 'price-asc':
        return 'Giá: Thấp đến cao'
      case 'price-desc':
        return 'Giá: Cao đến thấp'
      case 'name-asc':
        return 'Tên: A-Z'
      case 'name-desc':
        return 'Tên: Z-A'
    }
  }

  const handleEdit = (food: ProductModel) => {
    setEditingFood(food)
    setIsEditDialogOpen(true)
  }

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

  const updateFood = (updatedFood: ProductModel) => {
    setDisplayedProducts((prevProducts) =>
      prevProducts.map((food) => (food.id === updatedFood.id ? updatedFood : food))
    )
    setIsEditDialogOpen(false)
    setEditingFood(null)
  }

  return (
    <div className='space-y-6 mx-auto p-4 max-w-full'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Danh sách món ăn</h2>
        <div className='flex items-center gap-3'>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm' className='gap-2'>
                <Filter className='h-4 w-4' />
                Lọc
                {selectedCategory && (
                  <Badge variant='secondary' className='ml-1 rounded-sm px-1'>
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='end'>
              <div className='p-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Danh mục</h4>
                  {selectedCategory && (
                    <Button variant='ghost' size='sm' className='h-8 px-2' onClick={clearFilter}>
                      <X className='h-4 w-4' />
                      <span className='sr-only'>Xóa bộ lọc</span>
                    </Button>
                  )}
                </div>
                <Separator className='my-2' />
              </div>
              <ScrollArea className='h-[300px] px-3'>
                <div className='space-y-2'>
                  {foodCategory.map((category) => (
                    <Button
                      key={category.id}
                      variant='ghost'
                      className='w-full justify-start font-normal'
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className='flex items-center'>
                        {selectedCategory === category.id && <Check className='mr-2 h-4 w-4 text-primary' />}
                        <span className={selectedCategory === category.id ? 'ml-2' : 'ml-6'}>{category.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className='w-[180px]'>
              <div className='flex items-center gap-2'>
                <ArrowUpDown className='h-4 w-4' />
                <SelectValue placeholder='Sắp xếp'>{getSortLabel(sortOption)}</SelectValue>
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

      <div className='flex items-center gap-2'>
        {selectedCategory && (
          <Badge variant='secondary' className='flex items-center gap-1'>
            Danh mục: {getCategoryName(selectedCategory)}
            <Button variant='ghost' size='sm' className='h-4 w-4 p-0 ml-1' onClick={clearFilter}>
              <X className='h-3 w-3' />
              <span className='sr-only'>Xóa bộ lọc</span>
            </Button>
          </Badge>
        )}

        <Badge variant='outline' className='flex items-center gap-1'>
          Sắp xếp: {getSortLabel(sortOption)}
        </Badge>

        {(selectedCategory || sortOption !== 'newest') && (
          <Button
            variant='default'
            size='sm'
            className='h-8 px-2 text-xs'
            onClick={() => {
              setSelectedCategory('')
              setSortOption('newest')
            }}
          >
            Đặt lại
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className='h-full animate-pulse'>
                <div className='w-full h-40 bg-gray-300'></div>
                <CardContent className='p-4'>
                  <div className='h-6 bg-gray-300 rounded mb-2'></div>
                  <div className='h-4 bg-gray-300 rounded'></div>
                </CardContent>
                <CardFooter className='p-4 pt-0'>
                  <div className='h-6 bg-gray-300 rounded w-1/2'></div>
                </CardFooter>
              </Card>
            ))
          : displayedProducts.map((food) => (
              <Card key={food.id} className='h-full'>
                <div className='w-full h-64'>
                  <img
                    src={`data:image/jpeg;base64,` + food.image}
                    alt={food.name}
                    className='object-cover w-full h-full'
                  />
                </div>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-semibold text-lg'>{food.name}</h3>
                      <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{food.description}</p>
                      <Badge variant='outline' className='mt-2'>
                        {getCategoryName(food.categoryId)}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(food)}>
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
                </CardContent>
                <CardFooter className='p-4 pt-0 flex justify-between items-center'>
                  <span className='font-semibold text-primary'>{food.price.toLocaleString('vi-VN')} ₫</span>
                </CardFooter>
              </Card>
            ))}
      </div>

      {displayedProducts.length === 0 && !loading && (
        <div className='text-center py-10'>
          <p className='text-muted-foreground'>Không tìm thấy món ăn nào phù hợp với bộ lọc</p>
          {(selectedCategory || sortOption !== 'newest') && (
            <Button
              variant='link'
              onClick={() => {
                setSelectedCategory('')
                setSortOption('newest')
              }}
            >
              Đặt lại tất cả bộ lọc
            </Button>
          )}
        </div>
      )}

      {editingFood && (
        <EditFoodDialog
          food={editingFood}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={updateFood}
        />
      )}

      {/* <DeleteFoodDialog
        food={isDeletingFood}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      /> */}
    </div>
  )
}

export default FoodList
