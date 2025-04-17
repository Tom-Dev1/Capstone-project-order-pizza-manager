"use client"

import { Users, MoreVertical, QrCode, Edit, History, Eye, Clock, Lock, Utensils, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import { getStatusBadge } from "@/utils/table-utils"
import type TableResponse from "@/types/tables"
import { TableTimer } from "../table-timer"

interface TableCardProps {
    table: TableResponse
    isLoading: boolean
    isTimerRunning: boolean
    onTimeUp: () => void
    onOpenTable: (tableId: string) => Promise<void>
    onCloseTable: (tableId: string) => Promise<void>
    onOpenDetails: (table: TableResponse) => void
    onOpenQRCode: (table: TableResponse) => void
    onOpenUpdateDialog: (table: TableResponse) => void
    onOpenLockDialog: (table: TableResponse) => void
    onOpenReserveDialog: (table: TableResponse) => void
}

export function TableCard({
    table,
    isLoading,
    isTimerRunning,
    onTimeUp,
    onOpenTable,
    onCloseTable,
    onOpenDetails,
    onOpenQRCode,
    onOpenUpdateDialog,
    onOpenLockDialog,
    onOpenReserveDialog,
}: TableCardProps) {
    // Function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Opening":
                return "bg-emerald-50 border-emerald-200"
            case "Reserved":
                return "bg-blue-50 border-blue-200"
            case "Closing":
                return "bg-red-50 border-red-200"
            case "Locked":
                return "bg-amber-50 border-amber-200"
            default:
                return "bg-gray-50 border-gray-200"
        }
    }

    // Function to get status icon with color
    const getStatusIconWithColor = (status: string) => {
        switch (status) {
            case "Opening":
                return <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
            case "Reserved":
                return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            case "Closing":
                return <CircleX className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            case "Locked":
                return <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            default:
                return null
        }
    }

    // Function to get action buttons based on table status
    const getActionButtons = () => {
        switch (table.status) {
            case "Closing":
                return (
                    <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4">
                        <Button
                            onClick={() => onOpenTable(table.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Mở bàn"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                            disabled={isLoading}
                            onClick={() => onOpenReserveDialog(table)}
                        >
                            Đặt trước
                        </Button>
                    </div>
                )
            case "Opening":
                return (
                    <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4">
                        <Button
                            onClick={() => onCloseTable(table.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-red-200 text-red-700 hover:bg-red-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đóng bàn"}
                        </Button>
                        <Button
                            onClick={() => onOpenLockDialog(table)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-amber-200 text-amber-700 hover:bg-amber-50"
                            disabled={isLoading}
                        >
                            Bảo trì
                        </Button>
                    </div>
                )
            case "Reserved":
                return (
                    <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4">
                        <Button
                            onClick={() => onCloseTable(table.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-red-200 text-red-700 hover:bg-red-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đóng bàn"}
                        </Button>
                        <Button
                            onClick={() => onOpenLockDialog(table)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-amber-200 text-amber-700 hover:bg-amber-50"
                            disabled={isLoading}
                        >
                            Bảo trì
                        </Button>
                    </div>
                )
            case "Locked":
                return (
                    <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4">
                        <Button
                            onClick={() => onOpenTable(table.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Mở bàn"}
                        </Button>
                        <Button
                            onClick={() => onCloseTable(table.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 font-medium text-xs sm:text-sm py-1 h-7 sm:h-8 border-red-200 text-red-700 hover:bg-red-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đóng bàn"}
                        </Button>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <Card
            className={`overflow-hidden transition-all border-l-4 truncate ${table.status === "Opening"
                ? "border-l-emerald-500"
                : table.status === "Reserved"
                    ? "border-l-blue-500"
                    : table.status === "Closing"
                        ? "border-l-red-500"
                        : table.status === "Locked"
                            ? "border-l-amber-500"
                            : "border-l-gray-300"
                } hover:scale-[1.02] transition-transform duration-200`}
        >
            <CardHeader
                className={`flex flex-row items-center justify-between p-2 sm:p-4 ${getStatusColor(table.status)} border-b`}
            >
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-white">
                        {getStatusIconWithColor(table.status)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg sm:text-2xl">{table.code}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="hidden sm:block">{getStatusBadge(table.status)}</div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-white/80">
                                <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="sr-only">Tùy chọn</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 sm:w-48 border-amber-200">
                            <DropdownMenuItem
                                onClick={() => onOpenDetails(table)}
                                className="flex items-center cursor-pointer hover:bg-amber-50 text-xs sm:text-sm py-1.5"
                            >
                                <Eye className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                                Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onOpenUpdateDialog(table)}
                                className="flex items-center cursor-pointer hover:bg-amber-50 text-xs sm:text-sm py-1.5"
                            >
                                <Edit className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onOpenDetails(table)}
                                className="flex items-center cursor-pointer hover:bg-amber-50 text-xs sm:text-sm py-1.5"
                            >
                                <History className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                                Lịch sử
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onOpenQRCode(table)}
                                className="flex items-center cursor-pointer hover:bg-amber-50 text-xs sm:text-sm py-1.5"
                            >
                                <QrCode className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                                Mã QR
                            </DropdownMenuItem>
                            {/* Add Lock table option to dropdown menu */}
                            {table.status !== "Locked" && (
                                <DropdownMenuItem
                                    onClick={() => onOpenLockDialog(table)}
                                    className="flex items-center cursor-pointer hover:bg-amber-50 text-xs sm:text-sm py-1.5"
                                >
                                    <Lock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                                    Khóa bàn
                                </DropdownMenuItem>
                            )}
                            {(table.status === "Closing") && (
                                <DropdownMenuItem
                                    onClick={() => onOpenReserveDialog(table)}
                                    className="flex items-center cursor-pointer hover:bg-amber-50 text-xs sm:text-sm py-1.5"
                                >
                                    <Clock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                    Đặt trước
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
                <div className="space-y-2 sm:space-y-3 min-h-[80px] sm:min-h-[100px]">
                    <div className="flex items-center text-xs sm:text-sm bg-amber-50/50 p-1.5 sm:p-2.5 rounded-md">
                        <Users className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                        <span className="text-amber-800">Sức chứa:</span>
                        <Badge variant="outline" className="ml-auto font-medium text-xs bg-white border-amber-200 text-amber-700">
                            {table.capacity} người
                        </Badge>
                    </div>

                    {table.status === "Reserved" && (
                        <div className="flex items-center justify-between text-xs sm:text-sm bg-blue-50 p-1.5 sm:p-2.5 rounded-md">
                            <div className="flex items-center">
                                <Clock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="text-blue-700 font-medium">Thời gian:</span>
                            </div>
                            <div className="font-medium text-blue-700">
                                <TableTimer tableId={table.id} status={table.status} isRunning={isTimerRunning} onTimeUp={onTimeUp} />
                            </div>
                        </div>
                    )}

                    {table.status === "Closing" && (
                        <div className="flex items-center text-xs sm:text-sm bg-red-50 p-1.5 sm:p-2.5 rounded-md">
                            <CircleX className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            <span className="text-red-700 font-medium">Bàn đang đóng</span>
                        </div>
                    )}

                    {table.status === "Locked" && (
                        <div className="flex items-center text-xs sm:text-sm bg-amber-50 p-1.5 sm:p-2.5 rounded-md">
                            <Lock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                            <span className="text-amber-700 font-medium">Bàn đang khóa</span>
                        </div>
                    )}

                    {table.currentOrderId && (
                        <div
                            onClick={() => onOpenDetails(table)}
                            className="flex items-center justify-between text-xs sm:text-sm bg-emerald-50 p-1.5 sm:p-2.5 rounded-md cursor-pointer hover:bg-emerald-100 transition-colors"
                        >
                            <div className="flex items-center">
                                <Utensils className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                                <span className="text-emerald-700 font-medium">Đơn hàng:</span>
                            </div>
                            <Badge variant="outline" className="font-medium text-xs bg-white border-emerald-200 text-emerald-700">
                                Đang phục vụ
                            </Badge>
                        </div>
                    )}
                </div>

                {getActionButtons()}
            </CardContent>
        </Card>
    )
}
