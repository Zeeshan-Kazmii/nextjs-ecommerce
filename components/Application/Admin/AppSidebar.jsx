import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import { Button } from '@/components/ui/button'
import { LuChevronRight } from 'react-icons/lu'
import { IoMdClose } from 'react-icons/io'
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Link from 'next/link'
const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className='border-b h-14 p-0'>
        <div className='flex justify-between items-center px-4'>
            <Image src={logoBlack} height={50} width={logoBlack.width} className='block dark:hidden h-[50px] w-auto' alt='logo dark'/>
            <Image src={logoWhite} height={50} width={logoWhite.width} className='hidden dark:block h-[50px] w-auto' alt='logo white'/>
            <Button type='button' size='icon' className='md:hidden'>
               <IoMdClose />
            </Button>
        </div>        
    </SidebarHeader>   
      <SidebarContent className="p-3">
        <SidebarMenu>
            {adminAppSidebarMenu.map((menu, index) => (
                <Collapsible key={index} className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild className="font-semiblod px-2 py-5">
                            <Link href={menu?.url}>
                            <menu.icon />
                            {menu.title}
                            { menu.submenu && menu.submenu.length > 0 && 
                            <LuChevronRight className='ml-auto duration-200 group-data-[state=open]/collapsible:rotate-90 transition-transform' />}
                            </Link>
                        </SidebarMenuButton>
                        </CollapsibleTrigger>

                        { menu.submenu && menu.submenu.length > 0 && 
                        <CollapsibleContent>
                        <SidebarMenuSub>
                            {menu.submenu.map((submenuItem, subMenuIndex) => (
                                <SidebarMenuSubItem key={subMenuIndex}>
                                    <SidebarMenuSubButton asChild className="px-2 py-5">
                                        <Link href={submenuItem.url}>
                                        {submenuItem.title}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                        </CollapsibleContent> }
                    </SidebarMenuItem>
                </Collapsible>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
    )
}

export default AppSidebar