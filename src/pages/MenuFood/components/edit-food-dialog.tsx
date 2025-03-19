import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProductModel } from '@/types/product'
import useCategories from '@/hooks/useCategories'
import FileUpload from '@/components/uploadImage'
import { Loader2 } from 'lucide-react'

interface EditFoodDialogProps {
  food: ProductModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedFood: ProductModel) => void
}

export function EditFoodDialog({ food, open, onOpenChange, onSave }: EditFoodDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { foodCategory } = useCategories()

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
        description: food.description || '',
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

  const handleImageChange = useCallback((base64: string) => {
    setFormData((prev) => ({ ...prev, image: base64 }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!food) return

    setIsSubmitting(true)

    try {
      // Create updated food object
      const updatedFood: ProductModel = {
        ...food,
        name: formData.name,
        price: Number.parseFloat(formData.price),
        description: formData.description,
        categoryId: formData.categoryId,
        productType: Number.parseInt(formData.productType),
        image: formData.image,
        category: foodCategory.find((c) => c.id === formData.categoryId) || food.category
      }

      // call an API to update the food

      await new Promise((resolve) => setTimeout(resolve, 500))

      onSave(updatedFood)
    } catch (error) {
      console.error('Error updating food:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!food) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
          <DialogDescription>Cập nhật thông tin chi tiết về món ăn</DialogDescription>
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
                type='text'
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setFormData((prev) => ({ ...prev, price: value }))
                }}
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

          <div className=' gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='categoryId'>Danh mục</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn danh mục' />
                </SelectTrigger>
                <SelectContent>
                  {foodCategory.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='image'>Hình ảnh món ăn</Label>
            <FileUpload onImageChange={handleImageChange} value={formData.image} />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
