import type React from 'react'
import { useCallback, useState } from 'react'
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
import useCategories from '@/hooks/useCategories'
import FileUpload from '@/components/uploadImage'
import ProductService from '@/services/product-service'
import { ProductFormData } from '@/types/product'

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFoodDialog({ open, onOpenChange }: AddFoodDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    image: '',
    categoryId: '',
    productType: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  console.log('formData', formData)

  const { foodCategory } = useCategories()

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

    try {
      setIsSubmitting(true)
      const productService = ProductService.getInstance()
      const response = await productService.createProduct(JSON.stringify(formData))
      if (!response.result && !response.success) {
        throw new Error('Failed to save food')
      }
      console.log('Food saved successfully')
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting food:', error)
      alert('Có lỗi xảy ra khi lưu món ăn. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Thêm món ăn mới</DialogTitle>
          <DialogDescription>Vui lòng điền thông tin chi tiết về món ăn mới.</DialogDescription>
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

          <div className='grid grid-cols-1 gap-4'>
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
