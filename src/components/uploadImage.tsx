import { useState, ChangeEvent, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onImageChange?: (base64: string) => void
  value?: string
}

export default function FileUpload({ onImageChange, value }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(value || null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isFirstRender = useRef(true)
  const previousValue = useRef(value)

  // Handle external value changes
  useEffect(() => {
    if (value !== previousValue.current) {
      setBase64Image(value || null)
      previousValue.current = value
    }
  }, [value])

  // Convert file to base64 when file changes
  useEffect(() => {
    // Skip on first render to prevent unnecessary processing
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!file) return

    const convertToBase64 = async () => {
      setIsLoading(true)
      try {
        const base64 = await fileToBase64(file)
        setBase64Image(base64)

        // Only call onImageChange if the base64 value has actually changed
        if (onImageChange && base64 !== base64Image) {
          onImageChange(base64)
        }
      } catch (error) {
        console.error('Error converting file to base64:', error)
      } finally {
        setIsLoading(false)
      }
    }

    convertToBase64()
  }, [file]) // Remove onImageChange from dependencies

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (!selectedFile.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh (SVG, PNG, JPG, hoặc GIF)')
        return
      }
      setFile(selectedFile)
    }
  }

  return (
    <Card className='border-dashed'>
      <CardContent className='p-4'>
        {!base64Image ? (
          <div className='flex items-center justify-center w-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Upload className='w-8 h-8 text-gray-400 mb-1' />
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  <span className='font-semibold'>Nhấp để tải lên</span> hoặc kéo và thả
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>SVG, PNG, JPG hoặc GIF</p>
              </div>
              <input
                id='dropzone-file'
                type='file'
                className='hidden'
                onChange={handleFileChange}
                accept='image/svg+xml,image/png,image/jpeg,image/gif'
              />
            </label>
          </div>
        ) : (
          <div className='space-y-3'>
            {isLoading ? (
              <div className='flex justify-center items-center h-32'>
                <p>Đang xử lý...</p>
              </div>
            ) : (
              <div className='space-y-3'>
                <div className='border rounded-lg overflow-hidden flex justify-center'>
                  <img src={base64Image || '/placeholder.svg'} alt='Preview' className='h-32 object-contain' />
                </div>
                <div className='flex justify-end'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setFile(null)
                      setBase64Image(null)
                      if (onImageChange) {
                        onImageChange('')
                      }
                    }}
                  >
                    Thay đổi
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
