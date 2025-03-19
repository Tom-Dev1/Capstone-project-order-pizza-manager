import { Outlet, Link, useLocation } from 'react-router-dom'
import { SidebarProvider } from './context/SidebarContext'
import { SidebarItem } from './sidebarItem'
import Sidebar from './sidebar'
import {
  LayoutDashboard,
  Table,
  ChefHat,
  ClipboardList,
  Utensils,
  Users,
  UserCircle,
  Tag,
  BarChart,
  MoreHorizontal
} from 'lucide-react'
import Header from './header'

const DashboardLayout = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/in-tables':
        return 'In Tables'
      case '/kitchens':
        return 'Kitchens'
      case '/orders':
        return 'Orders'
      case '/menuFood':
        return 'Menu Food'
      case '/customers':
        return 'Customers'
      case '/staffs':
        return 'Staffs'
      case '/promotion':
        return 'Promotion'
      case '/reports':
        return 'Reports'
      case '/more':
        return 'More'
      default:
        return 'Dashboard'
    }
  }

  return (
    <SidebarProvider>
      <div className='flex h-screen '>
        <Sidebar>
          <Link to='/'>
            <SidebarItem icon={<LayoutDashboard size={20} />} text='Dashboard' active={isActive('/')} />
          </Link>
          <Link to='/in-tables'>
            <SidebarItem icon={<Table size={20} />} text='In Tables' active={isActive('/in-tables')} />
          </Link>
          <Link to='/kitchens'>
            <SidebarItem icon={<ChefHat size={20} />} text='Kitchens' active={isActive('/kitchens')} />
          </Link>
          <Link to='/orders'>
            <SidebarItem icon={<ClipboardList size={20} />} text='Orders' active={isActive('/orders')} />
          </Link>
          <Link to='/menuFood'>
            <SidebarItem icon={<Utensils size={20} />} text='Menu Food' active={isActive('/menuFood')} />
          </Link>
          <Link to='/customers'>
            <SidebarItem icon={<Users size={20} />} text='Customers' active={isActive('/customers')} />
          </Link>
          <Link to='/staffs'>
            <SidebarItem icon={<UserCircle size={20} />} text='Staffs' active={isActive('/staffs')} />
          </Link>
          <Link to='/promotion'>
            <SidebarItem icon={<Tag size={20} />} text='Promotion' active={isActive('/promotion')} />
          </Link>
          <hr />
          <Link to='/reports'>
            <SidebarItem icon={<BarChart size={20} />} text='Reports' active={isActive('/reports')} />
          </Link>
          <Link to='/more'>
            <SidebarItem icon={<MoreHorizontal size={20} />} text='More' active={isActive('/more')} />
          </Link>
          <Link to='/more'>
            <SidebarItem icon={<MoreHorizontal size={20} />} text='More' active={isActive('/more')} />
          </Link>
          <Link to='/more'>
            <SidebarItem icon={<MoreHorizontal size={20} />} text='More' active={isActive('/more')} />
          </Link>
        </Sidebar>
        <div className='flex flex-col flex-1 relative overflow-hidden'>
          <Header title={getHeaderTitle()} />
          <main className='flex-1 overflow-y-auto max-h-screen '>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
