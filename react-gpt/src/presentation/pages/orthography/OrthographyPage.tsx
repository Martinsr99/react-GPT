import React, { useState } from 'react'
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components'
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, {text,isGpt:false}])

    const {ok,errors,userScore,message} = await orthographyUseCase(text)

    if(!ok) {
      setMessages((prev) => [...prev, {text:'No se pudo realizar la corrección',isGpt:true}])
    } else {
      setMessages((prev) => [...prev, {text:message,isGpt:true, info: {
        userScore,
        errors,
        message
      }}])
    }
    setIsLoading(false)

    //TODO: add isGpt to true
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text="Introduce tu texto para empezar a ayudarte" />
          {
            messages.map((message ,index) => (
              message.isGpt ? (
              <GptOrthographyMessage 
              key={index} 
              {...message.info!}
              />
            ) : <MyMessage key={index} text={message.text} 
              />
            ))
          }
          {
            isLoading && (          <div className="col-start-1 col-end-12 fade-in" >
              <TypingLoader/>
              </div>)
          }


        </div>
      </div>
      <TextMessageBox onSendMessage={handlePost} placeholder='Escribe aqui lo que deseas'/>
      {/* <TextMessageBoxFile onSendMessage={handlePost} placeholder='Escribe aqui lo que deseas'/> */}
      {/* <TextMessageBoxSelect options={[{id:'1',text:'Hola'},{id:'2',text:'Mundo'}]} onSendMessage={console.log} placeholder='Escribe aqui lo que deseas'/> */}
    </div>
  )
}
