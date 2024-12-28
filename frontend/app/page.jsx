import React from 'react'
import Chat from '../components/chat'
import Header from '../components/Navbar'
const AskAIPage = () => {
  return (
    <div className="h-[calc(100vh-6rem)] bg-gradient-to-b from-blue-50 to-red-50 flex items-center justify-center">
      <div className="h-full w-full max-w-4xl border-2 border-gray-300">
        <Chat />
      </div>
    </div>
  )
}

export default AskAIPage