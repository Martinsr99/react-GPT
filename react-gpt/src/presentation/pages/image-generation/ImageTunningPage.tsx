import { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage } from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean
  info?: {
    imageUrl: string
    alt: string
  }
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined
  })

  const handleVariation = async() => {
    setIsLoading(true)
    const resp = await imageGenerationUseCase(originalImageAndMask.original!)
    setIsLoading(false)
    if(!resp) return

    setMessages((prev) => [...prev, {text:'Variación',isGpt:true, info:{imageUrl:resp.url, alt:resp.alt}}])
  }

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, {text,isGpt:false}])

    const imageInfo = await imageGenerationUseCase(text)
    
    setIsLoading(false)

    //TODO: add isGpt to true
    if(!imageInfo) return setMessages((prev) => [...prev, {text:'No se pudo generar la imagen',isGpt:true}])

    setMessages((prev) => [...prev, {text,isGpt:true,info:{imageUrl:imageInfo.url, alt:imageInfo.alt}}])


  }

  return (
    <>
    {originalImageAndMask.original && (
      <div className='fixed flex-col items-center top-10 right-10 z-10 fade-in'>
        <span>Editando</span>
        <img src={originalImageAndMask.original} alt='Imagen original' className='border rounded-xl w-36 h-36 object-contain'/>
        <button onClick={handleVariation} className='btn-primary mt-2'>Generar variación</button>
      </div>
    )}
        <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text="¿Qué imagen quieres generar?" />
          {
            messages.map((message ,index) => (
              message.isGpt ? (<GptMessageImage key={index} imageUrl={message.info?.imageUrl!} alt={message.info?.alt!} />) : <MyMessage key={index} text={message.text} />
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
    </>

  )
}
