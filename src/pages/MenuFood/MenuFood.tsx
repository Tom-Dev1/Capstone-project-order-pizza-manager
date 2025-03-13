import React from 'react'
import { MenuFoodHeader } from './components/Header'
import FoodList from './components/FoodList'

const MenuFood: React.FC = () => {
  return (
    <div>
      <MenuFoodHeader />

      <FoodList />
    </div>
  )
}

export default MenuFood
