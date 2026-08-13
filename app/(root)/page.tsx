import { ConversationView } from "@/features/conversation/components/conversation-view";
import React from 'react'

const page = async () => {
  const newId = crypto.randomUUID();
  
  return (
    <ConversationView
      conversationId={newId}
      initialMessages={[]}
    />
  )
}

export default page
