import { toast } from "sonner"

interface TableLockToastProps {
  tableCode: string
  note?: string
  duration?: number
}

export const showToastSuccess = ({ tableCode, note, duration = 5000 }: TableLockToastProps) => {
  return toast.custom(
    (id: string | number) => (
      <div className="flex items-start gap-3 bg-[#ECFDF3] text-[#008A2E] border border-green-200 py-4 px-3 rounded-md shadow-sm w-[356px] max-w-sm">
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            height="20"
            width="20"
            className="text-green-700 mr-0.5"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-[13px] font-medium ml-1">
            Bàn <strong>{tableCode}</strong> đã được khóa để bảo trì
            {note && (
              <>
                <br />
                <span className="text-xs text-green-600">Lý do: "{note}"</span>
              </>
            )}
          </div>
        </div>

        <button onClick={() => toast.dismiss(id)} className="ml-auto text-xs text-green-600 hover:underline">
          Đóng
        </button>
      </div>
    ),
    { duration },
  )
}


