import { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean
  info?: {
    imageUrl: string
    alt: string
  }
}

export const ImageGenerationPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, {text,isGpt:false}])

    const imageInfo = await imageGenerationUseCase(text)
    
    setIsLoading(false)

    //TODO: add isGpt to true
    if(!imageInfo) return setMessages((prev) => [...prev, {text:'No se pudo generar la imagen',isGpt:true}])

    


  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text="¿Qué imagen quieres generar?" />
          {
            messages.map((message ,index) => (
              message.isGpt ? (<GptMessage key={index} text='Esto es de OpenAI' />) : <MyMessage key={index} text={message.text} />
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
