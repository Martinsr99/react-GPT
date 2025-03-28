import React, { useRef, useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsStreamGeneratorUseCase, prosConsStreamUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean
}

export const ProsConsStreamPage = () => {

  const abortController = useRef(new AbortController())
  const isRunning = useRef(false)

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {

    if(isRunning.current){
      abortController.current.abort()
      abortController.current = new AbortController()
    }

    setIsLoading(true)
    isRunning.current = true
    setMessages((prev) => [...prev, {text,isGpt:false}])

    // TODO: useCase
    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal)

    setIsLoading(false)

    setMessages((messages) => [...messages, {text: '', isGpt: true}])

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      })
    }
    isRunning.current = false
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text="¿Qué quieres comparar?" />
          {
            messages.map((message ,index) => (
              message.isGpt ? (<GptMessage key={index} text={message.text} />) : <MyMessage key={index} text={message.text} />
            ))
          }
          {
            isLoading && (          <div className="col-start-1 col-end-12 fade-in" >
              <TypingLoader/>
              </div>)
          }


        </div>
      </div>
      <TextMessageBox onSendMessage={handlePost} placeholder='Escribe aqui lo que deseas' disableCorrections/>
    </div>
  )
}
