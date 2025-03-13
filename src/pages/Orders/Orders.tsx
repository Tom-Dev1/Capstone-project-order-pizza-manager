import React from 'react'
import { OrdersList } from './components/orders-list'

const Orders: React.FC = () => {
  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 p-6'>
        <OrdersList />
      </div>
    </div>
  )
}

export default Orders
