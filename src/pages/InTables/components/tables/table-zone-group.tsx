import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TableCard } from "./table-card"
import type TableResponse from "@/types/tables"

interface TableZoneGroupProps {
    zoneId: string
    zoneName: string
    tables: TableResponse[]
    loadingTableIds: string[]
    runningTimers: { [key: string]: boolean }
    onTimeUp: (tableId: string) => void
    onOpenTable: (tableId: string) => Promise<void>
    onCloseTable: (tableId: string) => Promise<void>
    onOpenDetails: (table: TableResponse) => void
    onOpenQRCode: (table: TableResponse) => void
    onOpenUpdateDialog: (table: TableResponse) => void
    onOpenLockDialog: (table: TableResponse) => void
    onOpenReserveDialog: (table: TableResponse) => void
}

export function TableZoneGroup({

    zoneName,
    tables,
    loadingTableIds,
    runningTimers,
    onTimeUp,
    onOpenTable,
    onCloseTable,
    onOpenDetails,
    onOpenQRCode,
    onOpenUpdateDialog,
    onOpenLockDialog,
    onOpenReserveDialog,
}: TableZoneGroupProps) {
    return (
        <div className="mb-6 last:mb-0">
            <div className="flex items-center mb-3 bg-amber-50 p-2 rounded-md border border-amber-100">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mr-2" />
                <h3 className="font-medium text-amber-800 text-sm sm:text-base">{zoneName}</h3>
                <Badge variant="outline" className="ml-auto bg-white text-amber-700 border-amber-200 text-xs">
                    {tables.length} bàn
                </Badge>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tables.map((table) => (
                    <TableCard
                        key={table.id}
                        table={table}
                        isLoading={loadingTableIds.includes(table.id)}
                        isTimerRunning={runningTimers[table.id] || false}
                        onTimeUp={() => onTimeUp(table.id)}
                        onOpenTable={onOpenTable}
                        onCloseTable={onCloseTable}
                        onOpenDetails={onOpenDetails}
                        onOpenQRCode={onOpenQRCode}
                        onOpenUpdateDialog={onOpenUpdateDialog}
                        onOpenLockDialog={onOpenLockDialog}
                        onOpenReserveDialog={onOpenReserveDialog}
                    />
                ))}
            </div>
        </div>
    )
}
