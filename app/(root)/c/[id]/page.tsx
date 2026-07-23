import { loadChatMessages } from '@/features/ai/actions/chat-store';
import { getConversation } from '@/features/conversation/actions/conversation-action';
import { notFound } from 'next/navigation';
import React from 'react'


type conversationPageProps = {
    params : Promise<{id : string}>
}

const page = async ({params} : conversationPageProps) => {

    const {id} = await params;

    try {
      await getConversation(id);
    } catch (error) {
      notFound()
    }
     
    const initialMessages = await loadChatMessages(id);
  return (
    <div>
      Welcome {`${id}`}
    </div>
  )
}

export default page
