'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProductModel } from '@/types/product'
import type { CategoryModel } from '@/types/category'

// Sample categories
const sampleCategories: CategoryModel[] = [
  { id: '1', name: 'Pizza', description: 'Italian pizza' },
  { id: '2', name: 'Pasta', description: 'Italian pasta' },
  { id: '3', name: 'Burgers', description: 'American burgers' },
  { id: '4', name: 'Salads', description: 'Fresh salads' },
  { id: '5', name: 'Desserts', description: 'Sweet desserts' },
  { id: '6', name: 'Drinks', description: 'Refreshing beverages' }
]

interface EditFoodDialogProps {
  food: ProductModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedFood: ProductModel) => void
}

export function EditFoodDialog({ food, open, onOpenChange, onSave }: EditFoodDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    categoryId: '',
    productType: '',
    image: ''
  })

  useEffect(() => {
    if (food) {
      setFormData({
        id: food.id,
        name: food.name,
        price: food.price.toString(),
        description: food.description,
        categoryId: food.categoryId,
        productType: food.productType.toString(),
        image: food.image
      })
    }
  }, [food])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!food) return

    // Create updated food object
    const updatedFood: ProductModel = {
      ...food,
      name: formData.name,
      price: Number.parseFloat(formData.price),
      description: formData.description,
      categoryId: formData.categoryId,
      productType: Number.parseInt(formData.productType),
      image: formData.image,
      category: sampleCategories.find((c) => c.id === formData.categoryId) || food.category
    }

    onSave(updatedFood)
  }

  if (!food) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Tên món ăn</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Nhập tên món ăn'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='price'>Giá (VNĐ)</Label>
              <Input
                id='price'
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
                placeholder='Nhập giá'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Nhập mô tả món ăn'
              rows={3}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='categoryId'>Danh mục</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn danh mục' />
                </SelectTrigger>
                <SelectContent>
                  {sampleCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='productType'>Loại món</Label>
              <Select value={formData.productType} onValueChange={(value) => handleSelectChange('productType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại món' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>Món chính</SelectItem>
                  <SelectItem value='2'>Tráng miệng</SelectItem>
                  <SelectItem value='3'>Đồ uống</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='image'>Hình ảnh URL</Label>
            <Input
              id='image'
              name='image'
              value={formData.image}
              onChange={handleChange}
              placeholder='Nhập URL hình ảnh'
            />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type='submit'>Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
