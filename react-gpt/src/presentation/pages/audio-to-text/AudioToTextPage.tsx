import { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, TextMessageBoxFile } from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean
}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, {text,isGpt:false}])

    const resp = await audioToTextUseCase(audioFile,text )

    setIsLoading(false)

    if (!resp) return;

    setMessages((prev) => [...prev, { text: resp.data.text, isGpt: true }])
    
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text="¿Qué audio quieres generar hoy?" />
          {
            messages.map((message ,index) => (
              message.isGpt ? (<GptMessage key={index} text='{message.text}' />) : <MyMessage key={index} text={(message.text === '' ? 'Transcribe el audio': message.text)} />
            ))
          }
          {
            isLoading && (          <div className="col-start-1 col-end-12 fade-in" >
              <TypingLoader/>
              </div>)
          }


        </div>
      </div>
      <TextMessageBoxFile onSendMessage={handlePost} accept='audio/*' placeholder='Escribe aqui lo que deseas' disableCorrections/>
    </div>
  )
}
