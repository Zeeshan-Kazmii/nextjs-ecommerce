"use client"
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showTost'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useDispatch } from 'react-redux'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const route = useRouter()
  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post('/api/auth/logout')
      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message)
      }
      dispatch(logout())
      showToast("success", logoutResponse.message)
      route.push(WEBSITE_LOGIN)
    } catch (error) {
      showToast('error', error.message)
    }
  }

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
        <AiOutlineLogout className="text-red-500" />
        Logout
    </DropdownMenuItem>
  )
}

export default LogoutButton