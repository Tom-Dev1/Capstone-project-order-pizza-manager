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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useCategories from '@/hooks/useCategories'
import FileUpload from '@/components/uploadImage'
import ProductService from '@/services/product-service'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  name: z.string().min(1, 'Tên món ăn không được để trống'),
  price: z.number().min(1, 'Giá phải lớn hơn 0'),
  description: z.string().optional(),
  image: z.string().min(1, 'Vui lòng tải lên hình ảnh món ăn'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  productType: z.number().default(0)
})

type FormValues = z.infer<typeof formSchema>

export function AddFoodDialog({ open, onOpenChange }: AddFoodDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { foodCategory } = useCategories()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      image: '',
      categoryId: '',
      productType: 0
    }
  })

  const handleImageChange = useCallback(
    (base64: string) => {
      form.setValue('image', base64, { shouldValidate: true })
    },
    [form]
  )

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      const productService = ProductService.getInstance()
      const response = await productService.createProduct(JSON.stringify(data))
      if (!response.result && !response.success) {
        throw new Error('Failed to save food')
      }
      console.log('Food saved successfully')
      form.reset()
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên món ăn</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập tên món ăn' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        value={field.value === 0 ? '' : field.value.toLocaleString('vi-VN')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          field.onChange(value ? Number(value) : 0)
                        }}
                        placeholder='Nhập giá'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả món ăn' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn danh mục' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {foodCategory.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh món ăn</FormLabel>
                  <FormControl>
                    <FileUpload onImageChange={handleImageChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  'Lưu'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
