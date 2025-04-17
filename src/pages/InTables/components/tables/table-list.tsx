import { useState } from "react"
import { Coffee, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { TableZoneGroup } from "./table-zone-group"
import { TableLockDialog } from "./table-lock-dialog"
import { getZoneName } from "@/utils/zone-utils"
import TableService from "@/services/table-service"
import type TableResponse from "@/types/tables"
import useZone from "@/hooks/useZone"
import { TableDetailsDialog } from "../table-details.dialog"
import { TableQRCode } from "../table-qr-code"
import { TableUpdateDialog } from "../table-update-dialog"
import { TableAddDialog } from "../table-add-dialog"
import { TableReserveDialog } from "./table-reserve-dialog"
import { showToastSuccess } from "@/components/toast-notifications-table"

interface TableListProps {
    tables: TableResponse[]
    onTableUpdated?: () => void // Callback to refresh tables after update
}

export function TableList({ tables, onTableUpdated }: TableListProps) {
    const [selectedTable, setSelectedTable] = useState<TableResponse | null>(null)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [showQRCodeDialog, setShowQRCodeDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [showLockDialog, setShowLockDialog] = useState(false)
    const [showReserveDialog, setShowReserveDialog] = useState(false)
    const [runningTimers, setRunningTimers] = useState<{ [key: string]: boolean }>({})
    const [loadingTableIds, setLoadingTableIds] = useState<string[]>([]) // Track which tables are being updated
    const { zones_ } = useZone()

    const handleTimeUp = (tableId: string) => {
        setRunningTimers((prev) => ({ ...prev, [tableId]: false }))
        toast.warning(`Hết thời gian đặt trước cho bàn ${tables.find((t) => t.id === tableId)?.code || tableId}`)
        console.log(`Hết thời gian cho bàn ${tableId}`)
    }

    const handleOpenTable = async (tableId: string) => {
        setLoadingTableIds((prev) => [...prev, tableId]) // Set loading state for this table
        try {
            const tableSevice = TableService.getInstance()
            const res = await tableSevice.putOpenTable(tableId)
            const table = tables.find(t => t.id === tableId)
            const tableCode = table?.code || `ID: ${tableId}`
            if (res.success) {
                toast.success(`Bàn ${tableCode} đã được mở`)
            } else {
                toast.error(res.message)
            }

            // Call the callback to refresh table data
            if (onTableUpdated) {
                onTableUpdated()
            }
        } catch (error) {
            console.error(`Lỗi khi mở bàn với ID: ${tableId}`, error)
            toast.error("Không thể mở bàn. Vui lòng thử lại.")
        } finally {
            setLoadingTableIds((prev) => prev.filter((id) => id !== tableId)) // Remove loading state
        }
    }

    const handleCloseTable = async (tableId: string) => {
        setLoadingTableIds((prev) => [...prev, tableId]) // Set loading state for this table
        try {
            const tableSevice = TableService.getInstance()
            const res = await tableSevice.putCloseTable(tableId)
            const table = tables.find(t => t.id === tableId)
            const tableCode = table?.code || `ID: ${tableId}`
            if (res.success) {
                // toast.success(`Bàn ${tableCode} đã được đóng`, { duration: 1000000 })
                showToastSuccess({
                    tableCode,
                    duration: 5000,

                })
            } else {
                toast.error(res.message)
            }

            // Call the callback to refresh table data
            if (onTableUpdated) {
                onTableUpdated()
            }
        } catch (error) {
            toast.error("Không thể đóng bàn. Vui lòng thử lại.")
            console.error(`Lỗi khi đóng bàn với ID: ${tableId}`, error)
        } finally {
            setLoadingTableIds((prev) => prev.filter((id) => id !== tableId)) // Remove loading state
        }
    }

    const handleLockTable = async (tableId: string, note: string) => {
        setLoadingTableIds((prev) => [...prev, tableId]) // Set loading state for this table
        try {
            const tableService = TableService.getInstance()
            const res = await tableService.putLockTable(tableId, note)
            const table = tables.find(t => t.id === tableId)

            const tableCode = table?.code || `ID: ${tableId}`
            if (res.success) {
                showToastSuccess({
                    tableCode,
                    duration: 5000,
                    note

                })
                // toast.custom((t) => (
                //     <div>
                //         <div className="flex items-start gap-3 bg-[#ECFDF3] text-[#008A2E] border border-green-200 py-4 px-3 rounded-md shadow-sm w-[356px] max-w-sm">
                //             {/* SVG icon bạn gửi */}
                //             <div className="flex">
                //                 <svg
                //                     xmlns="http://www.w3.org/2000/svg"
                //                     viewBox="0 0 20 20"
                //                     fill="currentColor"
                //                     height="20"
                //                     width="20"
                //                     className=" text-green-700 mr-0.5"
                //                 >
                //                     <path
                //                         fillRule="evenodd"
                //                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                //                         clipRule="evenodd"
                //                     />
                //                 </svg>
                //                 {/* Nội dung */}
                //                 <div className="text-[13px] font-medium ml-1">
                //                     Bàn <strong>{tableCode}</strong> đã được khóa để bảo trì<br />
                //                     <span className="text-xs text-green-600">Lý do: "{note}"</span>
                //                 </div>
                //             </div>

                //             <button
                //                 onClick={() => toast.dismiss(t)}
                //                 className="ml-auto text-xs text-green-600 hover:underline"
                //             >
                //                 Đóng
                //             </button>
                //         </div>
                //     </div>
                // ), { duration: 10000000 });


                // toast.success(`Bàn ${tableCode} đã được khóa để bảo trì với lý do: "${note}"`)
                setShowLockDialog(false)
            } else {
                toast.error(res.message)
            }

            // Call the callback to refresh table data
            if (onTableUpdated) {
                onTableUpdated()
            }
        } catch (error) {
            toast.error("Không thể khóa bàn. Vui lòng thử lại.")
            console.error(`Lỗi khi khóa bàn với ID: ${tableId}`, error)
        } finally {
            setLoadingTableIds((prev) => prev.filter((id) => id !== tableId)) // Remove loading state
        }
    }

    const handleOpenDetails = (table: TableResponse) => {
        setSelectedTable(table)
        setShowDetailsDialog(true)
    }

    const handleOpenQRCode = (table: TableResponse) => {
        setSelectedTable(table)
        setShowQRCodeDialog(true)
    }

    const handleOpenUpdateDialog = (table: TableResponse) => {
        setSelectedTable(table)
        setShowUpdateDialog(true)
    }

    const handleOpenLockDialog = (table: TableResponse) => {
        setSelectedTable(table)
        setShowLockDialog(true)
    }
    const handleOpenReserveDialog = (table: TableResponse) => {
        setSelectedTable(table)
        setShowReserveDialog(true)
    }
    // Group tables by zone
    const tablesByZone = tables.reduce<Record<string, TableResponse[]>>((acc, table) => {
        const zoneId = table.zoneId
        if (!acc[zoneId]) {
            acc[zoneId] = []
        }
        acc[zoneId].push(table)
        return acc
    }, {})

    if (tables.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="rounded-full bg-white p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
                    <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                </div>
                <p className="text-amber-800 text-center font-medium text-sm sm:text-base">Không có bàn nào</p>
                <p className="text-xs sm:text-sm text-amber-600 text-center mt-1">Thêm bàn mới để bắt đầu quản lý</p>
                <Button onClick={() => setShowAddDialog(true)} className="mt-4 bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm bàn đầu tiên
                </Button>
            </div>
        )
    }

    return (
        <>
            {Object.entries(tablesByZone).map(([zoneId, zoneTables]) => (
                <TableZoneGroup
                    key={zoneId}
                    zoneId={zoneId}
                    zoneName={getZoneName(zoneId, zones_)}
                    tables={zoneTables}
                    loadingTableIds={loadingTableIds}
                    runningTimers={runningTimers}
                    onTimeUp={handleTimeUp}
                    onOpenTable={handleOpenTable}
                    onCloseTable={handleCloseTable}
                    onOpenDetails={handleOpenDetails}
                    onOpenQRCode={handleOpenQRCode}
                    onOpenUpdateDialog={handleOpenUpdateDialog}
                    onOpenLockDialog={handleOpenLockDialog}
                    onOpenReserveDialog={handleOpenReserveDialog}
                />
            ))}

            {/* Dialogs */}
            {selectedTable && (
                <>
                    <TableDetailsDialog table={selectedTable} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />
                    <TableQRCode table={selectedTable} open={showQRCodeDialog} onOpenChange={setShowQRCodeDialog} />
                    <TableUpdateDialog
                        table={selectedTable}
                        open={showUpdateDialog}
                        onOpenChange={setShowUpdateDialog}
                        onTableUpdated={onTableUpdated}
                    />
                    <TableLockDialog
                        table={selectedTable}
                        open={showLockDialog}
                        onOpenChange={setShowLockDialog}
                        onLockTable={handleLockTable}
                        isLoading={loadingTableIds.includes(selectedTable.id)}
                    />
                    <TableReserveDialog
                        table={selectedTable}
                        open={showReserveDialog}
                        onOpenChange={setShowReserveDialog}
                        isLoading={loadingTableIds.includes(selectedTable.id)}
                    />
                </>
            )}

            <TableAddDialog open={showAddDialog} onOpenChange={setShowAddDialog} onTableAdded={onTableUpdated} />
        </>
    )
}
