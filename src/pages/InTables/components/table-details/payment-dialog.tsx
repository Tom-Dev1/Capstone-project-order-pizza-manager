"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BanknoteIcon, QrCode, Loader2, CreditCard, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import PaymentService from "@/services/payment-service"
import { PaymentQRDialog } from "./payment-qr-dialog"
import type { OrderDetail } from "@/types/order"
import OrderService from "@/services/order-service"

interface PaymentDialogProps {
    orderId: string
    totalAmount: number
    open: boolean
    onOpenChange: (open: boolean) => void
    onPaymentComplete?: () => void
    onBackToDetails?: () => void
}

export function PaymentDialog({
    orderId,
    totalAmount,
    open,
    onOpenChange,
    onPaymentComplete,
    onBackToDetails,
}: PaymentDialogProps) {
    const [isLoadingCash, setIsLoadingCash] = useState(false)
    const [isLoadingQR, setIsLoadingQR] = useState(false)
    const [isCancelingQR, setIsCancelingQR] = useState(false)
    const [qrCodeData, setQrCodeData] = useState<string | null>(null)
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
    const [qrCodeGenerated, setQrCodeGenerated] = useState(false)
    const [orderDetail, setOrderDetail] = useState<OrderDetail>()

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
    }

    // Fetch order details when dialog opens
    useEffect(() => {
        if (open && orderId) {
            fetchOrderDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, orderId])

    const fetchOrderDetails = async () => {
        try {
            const orderService = OrderService.getInstance()
            const response = await orderService.getOrderById(orderId)
            if (response.success && response.result) {
                setOrderDetail(response.result)
            }
        } catch (error) {
            console.error("Error fetching order details:", error)
        }
    }

    // Effect to handle QR code cancellation when the QR dialog is closed
    useEffect(() => {
        // If QR code was generated but dialog is now closed, cancel the QR code silently
        if (qrCodeGenerated && !isQRDialogOpen && !isCancelingQR) {
            handleSilentCancelQR()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQRDialogOpen, qrCodeGenerated])

    const handlePayByCash = async () => {
        if (!orderId) return

        setIsLoadingCash(true)
        try {
            const paymentService = PaymentService.getInstance()
            const response = await paymentService.payOrderByCash(orderId)

            if (response.success) {
                toast.success("Thanh toán tiền mặt thành công")
                onOpenChange(false)
                if (onPaymentComplete) onPaymentComplete()
            } else {
                toast.error(response.message || "Không thể thanh toán bằng tiền mặt")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi thanh toán bằng tiền mặt")
            console.error("Error paying by cash:", error)
        } finally {
            setIsLoadingCash(false)
        }
    }

    const handleCreateQRCode = async () => {
        if (!orderId) return

        setIsLoadingQR(true)
        try {
            const paymentService = PaymentService.getInstance()
            const response = await paymentService.createPaymentQRCode(orderId)

            if (response.success && response.result) {
                // Store the QR code data
                setQrCodeData(response.result)
                // Mark that QR code was generated
                setQrCodeGenerated(true)
                // Open the QR code dialog
                setIsQRDialogOpen(true)
            } else {
                toast.error(response.message || "Không thể tạo mã QR thanh toán")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo mã QR thanh toán")
            console.error("Error creating QR code:", error)
        } finally {
            setIsLoadingQR(false)
        }
    }

    // Silent cancellation - no toast messages
    const handleSilentCancelQR = async () => {
        if (!orderId || isCancelingQR) return

        setIsCancelingQR(true)
        try {
            const paymentService = PaymentService.getInstance()
            await paymentService.cancelPaymentQRCode(orderId)
            // Reset QR code state without showing toast
            setQrCodeGenerated(false)
            setQrCodeData(null)
        } catch (error) {
            console.error("Error silently canceling QR code:", error)
        } finally {
            setIsCancelingQR(false)
        }
    }

    // Visible cancellation with toast messages - only used when clicking "Quay lại" in payment-dialog.tsx
    const handleCancelPaymentQR = async () => {
        if (!orderId || isCancelingQR) return

        setIsCancelingQR(true)
        try {
            const paymentService = PaymentService.getInstance()
            const response = await paymentService.cancelPaymentQRCode(orderId)

            if (response.success) {
                // Only show toast when explicitly canceling from the main payment dialog
                toast.success("Đã hủy mã QR thanh toán")
                // Reset QR code state
                setQrCodeGenerated(false)
                setQrCodeData(null)
            } else {
                toast.error(response.message || "Không thể hủy mã QR thanh toán")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi hủy mã QR thanh toán")
            console.error("Error canceling QR code:", error)
        } finally {
            setIsCancelingQR(false)
        }
    }

    const handleBack = () => {
        // Always cancel payment QR when going back
        handleCancelPaymentQR()

        onOpenChange(false)
        if (onBackToDetails) {
            // Give a small delay to avoid dialog transition issues
            setTimeout(() => {
                onBackToDetails()
            }, 100)
        }
    }

    const handleQRDialogBack = () => {
        // Just close the QR dialog, the useEffect will handle silent cancellation
        setIsQRDialogOpen(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                        <DialogTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Thanh toán đơn hàng
                        </DialogTitle>
                        <p className="text-amber-600 text-sm">Chọn phương thức thanh toán</p>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-sm text-slate-600">Tổng tiền thanh toán</p>
                            <p className="text-2xl font-bold text-amber-800">{formatCurrency(totalAmount)}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Card
                                className="border-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                                onClick={handlePayByCash}
                            >
                                <CardContent className="p-4 flex items-center">
                                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                                        <BanknoteIcon className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-amber-900">Thanh toán tiền mặt</h3>
                                        <p className="text-sm text-amber-600">Thanh toán trực tiếp bằng tiền mặt</p>
                                    </div>
                                    {isLoadingCash && <Loader2 className="h-5 w-5 text-amber-500 animate-spin ml-2" />}
                                </CardContent>
                            </Card>

                            <Card
                                className="border-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                                onClick={handleCreateQRCode}
                            >
                                <CardContent className="p-4 flex items-center">
                                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                                        <QrCode className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-amber-900">Thanh toán chuyển khoản</h3>
                                        <p className="text-sm text-amber-600">Quét mã QR để thanh toán</p>
                                    </div>
                                    {isLoadingQR && <Loader2 className="h-5 w-5 text-amber-500 animate-spin ml-2" />}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-amber-50 border-t border-amber-100">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={isCancelingQR}
                            className="w-full border-amber-200 text-amber-700 hover:bg-amber-100"
                        >
                            {isCancelingQR ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang hủy...
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Quay lại
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* QR Code Dialog */}
            {qrCodeData && (
                <PaymentQRDialog
                    open={isQRDialogOpen}
                    onOpenChange={setIsQRDialogOpen}
                    qrCodeData={qrCodeData}
                    amount={totalAmount}
                    onBack={handleQRDialogBack}
                    orderDetail={orderDetail}
                />
            )}
        </>
    )
}
