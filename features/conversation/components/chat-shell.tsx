"use client"

import {AppSidebar} from '@/features/conversation/components/app-sidedbar'
import { SidebarInset , SidebarProvider } from "@/components/ui/sidebar"

export function ChatShell({children} : {children : React.ReactNode}){
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className="min-h-svh flex flex-col">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}