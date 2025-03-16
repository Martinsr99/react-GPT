import type { ProsConsResponse } from "../../interfaces"

export async function* prosConsStreamGeneratorUseCase(prompt : string) {
    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prompt})

            //TODO: abort signaling request
        })
        if(!resp.ok) throw new Error('No se pudo realizar la comparación')

        const reader = resp.body?.getReader()

        if(!reader){
            console.log('no se pudo generar el reader')
            return null
        } 

        const decoder = new TextDecoder()

        let text = ''

        while(true){
            const {value, done} = await reader.read()
            if(done){
                break
            }

            const decodedChunk = decoder.decode(value, {stream: true})
            text += decodedChunk
            yield text;
        }

        

        
    } catch (error) {
        return {

            ok:false,
            content: 'No se pudo realizar la comparación'
        }
    }
}