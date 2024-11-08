import React from 'react'
import { GptMessage, MyMessage, TypingLoader } from '../../components'

export const OrthographyPage = () => {
  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text="Introduce tu texto para empezar a ayudarte" />
          <MyMessage text="Hola Mundo"/>
          <TypingLoader className='fade-in'/>

        </div>
      </div>
    </div>
  )
}
