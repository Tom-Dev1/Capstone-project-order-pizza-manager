import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import WorkshopsPage from '@/pages/Workshops/WorkshopsPage'
import WorkshopDetail from '@/pages/Workshops/components/WorkshopDetail'
import WorkshopForm from '@/pages/Workshops/components/WorkshopForm'
import SettingsPage from '@/pages/Settings/Settings'
import LoginPage from '@/pages/Login/Login'
import StaffManagement from '@/pages/Shifts/staff-management'
import SignalRListener from '@/components/signalr/SignalRListener'

// Lazy load the components
const DashboardLayout = lazy(() => import('@/components/dashboard-layout'))
const Dashboard = lazy(() => import('@/pages/DashboradPage/index'))
const InTables = lazy(() => import('@/pages/InTables/InTables'))
const Kitchens = lazy(() => import('@/pages/Kitchens/Kitchens'))
const Orders = lazy(() => import('@/pages/Orders/Orders'))
const MenuFood = lazy(() => import('@/pages/MenuFood/MenuFood'))
const Staffs = lazy(() => import('@/pages/Staffs/Staffs'))
const Promotion = lazy(() => import('@/pages/Promotion/Promotion'))
const Reports = lazy(() => import('@/pages/Reports/Reports'))
const More = lazy(() => import('@/pages/More/More'))

// Loading component
import Loading from '@/routers/Loading'
import StaffZone from '@/pages/StaffZone/staff-zone'
import FeedbackPage from '@/pages/Feedback/page'
import UnauthorizedPage from '@/pages/Login/UnauthorizedPage'
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <SignalRListener />
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: 'in-tables',
        element: (
          <Suspense fallback={<Loading />}>
            <InTables />
          </Suspense>
        ),
        children: [
          {
            path: ':tab', // tab = tables | zones | booking
            element: (
              <Suspense fallback={<Loading />}>
                <InTables />
              </Suspense>
            )
          },
          {
            index: true, // fallback mặc định nếu không có tab
            element: <Navigate to='tables' />
          }
        ]
      },
      {
        path: 'kitchens',
        element: (
          <Suspense fallback={<Loading />}>
            <Kitchens />
          </Suspense>
        )
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<Loading />}>
            <Orders />
          </Suspense>
        )
      },
      {
        path: 'menuFood',
        element: (
          <Suspense fallback={<Loading />}>
            <MenuFood />
          </Suspense>
        )
      },
      {
        path: 'feedbacks',
        element: (
          <Suspense fallback={<Loading />}>
            <FeedbackPage />
          </Suspense>
        )
      },
      {
        path: 'staffs',
        element: (
          <Suspense fallback={<Loading />}>
            <Staffs />
          </Suspense>
        )
      },
      {
        path: 'promotion',
        element: (
          <Suspense fallback={<Loading />}>
            <Promotion />
          </Suspense>
        )
      },
      {
        path: 'schedule',
        element: (
          <Suspense fallback={<Loading />}>
            <StaffManagement />
          </Suspense>
        )
      },
      {
        path: 'workshops',
        element: (
          <Suspense fallback={<Loading />}>
            <WorkshopsPage />
          </Suspense>
        )
      },
      {
        path: 'workshops/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <WorkshopDetail />
          </Suspense>
        )
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<Loading />}>
            <SettingsPage />
          </Suspense>
        )
      },
      {
        path: '/workshops/create',
        element: (
          <Suspense fallback={<Loading />}>
            <WorkshopForm />
          </Suspense>
        )
      },
      {
        path: '/workshops/edit/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <WorkshopForm isEditing={true} />
          </Suspense>
        )
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<Loading />}>
            <Reports />
          </Suspense>
        )
      },
      {
        path: 'zones-staff',
        element: (
          <Suspense fallback={<Loading />}>
            <StaffZone />
          </Suspense>
        )
      },
      {
        path: 'more',
        element: (
          <Suspense fallback={<Loading />}>
            <More />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/' replace />
  }
])
