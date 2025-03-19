import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'sonner'

interface AddZoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onZoneAdded?: () => void
}

const apiUrl = import.meta.env.VITE_API_URL

const formSchema = z.object({
  name: z.string().min(1, 'Tên khu vực không được để trống'),
  capacity: z.number().min(0, 'Số lượng bàn không được âm'),
  description: z.string().optional(),
  status: z.number().int().min(0).max(2)
})

type FormValues = z.infer<typeof formSchema>

export function AddZoneDialog({ open, onOpenChange, onZoneAdded }: AddZoneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      description: '',
      status: 0
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // Gọi API để thêm khu vực mới
      const response = await axios.post(`${apiUrl}/zones`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Kiểm tra kết quả từ API
      if (response.status === 200 || response.status === 201) {
        toast.success('Thêm khu vực thành công')

        // Reset form và đóng dialog
        form.reset()
        onOpenChange(false)

        // Gọi callback để cập nhật danh sách khu vực
        if (onZoneAdded) {
          onZoneAdded()
        }
      } else {
        throw new Error('Thêm khu vực thất bại')
      }
    } catch (error) {
      console.error('Lỗi khi thêm khu vực:', error)
      toast.error('Lỗi khi thêm khu vực. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Thêm khu vực mới</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết để thêm khu vực mới vào hệ thống</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khu vực</FormLabel>
                  <FormControl>
                    <Input placeholder='Ví dụ: Tầng 1, Sân thượng...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng bàn</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min='0'
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Số lượng bàn tối đa có thể đặt trong khu vực này</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả về khu vực này...' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='0'>Hoạt động</SelectItem>
                      <SelectItem value='1'>Tạm ngưng</SelectItem>
                      <SelectItem value='2'>Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
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
                    Đang xử lý...
                  </>
                ) : (
                  'Thêm khu vực'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
