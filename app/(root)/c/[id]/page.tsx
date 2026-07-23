import { ChatShell } from '@/features/conversation/components/chat-shell';
import React from 'react'


type conversationPageProps = {
    params : Promise<{id : string}>
}

const page = async ({params} : conversationPageProps) => {

    const {id} = await params;
  return (
    <div>
      Welcome {`${id}`}
    </div>
  )
}

export default page
