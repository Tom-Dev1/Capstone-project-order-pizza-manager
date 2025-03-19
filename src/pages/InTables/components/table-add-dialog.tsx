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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useZone from '@/hooks/useZone'
import api from '@/apis/axiosConfig'
import { toast } from 'sonner'

interface TableAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTableAdded?: () => void
}
const apiUrl = import.meta.env.VITE_API_URL

const formSchema = z.object({
  code: z.string().min(1, 'Mã bàn không được để trống'), // spell-check-disable-line
  capacity: z.number().min(1, 'Số chỗ phải lớn hơn 0').max(10, 'Số chỗ nhỏ hơn 10'), // spell-check-disable-line
  zoneId: z.string().min(1, 'Vui lòng chọn khu vực') // spell-check-disable-line
})

type FormValues = z.infer<typeof formSchema>

export function TableAddDialog({ open, onOpenChange, onTableAdded }: TableAddDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { zones_ } = useZone()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      capacity: 4,
      zoneId: ''
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await api.post(`${apiUrl}/tables`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      toast.success('Thêm bàn thành công')
      console.log('Thêm bàn thành công')

      // Reset form và đóng dialog
      form.reset()
      onOpenChange(false)

      // Gọi callback nếu có
      if (onTableAdded) {
        onTableAdded()
      }
    } catch (error) {
      toast.error('Lỗi khi thêm bàn')
      console.error('Lỗi khi thêm bàn:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Thêm bàn mới</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết để thêm bàn mới vào hệ thống</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã bàn</FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: A01, B02...' {...field} />
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
                    <FormLabel>Số chỗ</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='1'
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='zoneId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khu vực</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn khu vực' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zones_.length === 0 ? (
                        <SelectItem value='empty' disabled>
                          Không có khu vực nào
                        </SelectItem>
                      ) : (
                        zones_.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang xử lý...
                  </>
                ) : (
                  'Thêm bàn'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
