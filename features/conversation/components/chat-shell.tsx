"use client"

import {AppSidebar} from '@/features/conversation/components/app-sidedbar'
import { SidebarInset , SidebarProvider } from "@/components/ui/sidebar"

export function ChatShell({children} : {children : React.ReactNode}){
    return (
        <SidebarProvider className="h-svh overflow-hidden">
            <AppSidebar/>
            <SidebarInset className="h-full flex flex-col overflow-hidden">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}