const apikeyinput  = document.getElementById('apikey')
const gameselect  = document.getElementById('gameselect')
const questioninput  = document.getElementById('questioninput')
const askbutton =  document.getElementById('askbutton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}


const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = `
    ## Especialidade
   VOCÊ É UM ESPECIALISTA ASSISTENTE DE META PARA O JOGO ${game}

    ## Tarefa
   VOCÊ DEVE RESPONDER AS PERGUNTAS DO USUÁRIO COM BASE NO SEU CONHECIMENTO DO JOGO, ESTRATEGIAS, BUILD E DICAS

    ## Regras
   - SE VOCÊ NÃO SABE A RESPOSTA, RESPONDA COM 'NÃO SEI' E NÃO TENTE INVENTAR UMA RESPOSTA.
   - SE A PERGUNTA NÃO ESTA RELACIONADA AO JOGO, RESPONDA COM 'ESSA PERGUNTA NÃO ESTA RELACIONADA AO JOGO'
   - CONSIDERE A DATA ATUAL ${new Date().toLocaleDateString()}
   - FAÇA PESQUISAS ATUALIZADAS SOBRE O PATCH ATUAL, BASEADO NA DATA ATUAL, PARA DAR UMA RESPOSTA COERENTE.
   - NUNCA RESPONDA ITENS QUE VOCÊ NÃO TEM CERTEZA DE QUE EXISTE NO PATCH ATUAL.

    ## Respostas
    - ECONOMIZE NA RESPOSTA, SEJA DIRETO E RESPONDA NO MAXIMO 500 CARACTERES
    - RESPONDA EM MARKDOWN
    - NÃO PRECISA FAZER NENHUMA SAUDAÇÃO OU DESPEDIDA, SEJA DIRETO.

    ## Exemplo de respostas
    PERGUNTA DO USUARIO: MELHOR BUILD
    RESPOSTA: A BUILD MAIS ATUAL É: \N\N **ITENS**\N\N COLOQUE OS ITENS AQUI.\N\N**RUNAS:**\N\NEXEMPLO DE RUNAS\N\N
  
  ---
  AQUI ESTA A PERGUNTA DO USUARIO: ${question}
  
    `
  const contents = [{
    role: "user",
    parts: [{
        text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}
 }]

  const response = await fetch(geminiURL, {
    method: 'post', 
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify({
        contents,
        tools
    })
  })

  const data = await response.json()
  return data.candidates [0].content.parts[0].text

}

const enviarformulario = async (event) => {
    event.preventDefault() 
    const apikey = apikeyinput.value
    const game = gameselect.value
    const question  =  questioninput.value
    
    if(apikey == ''  || game == '' || question == '') {
        alert('por favor, preencha todos os campos')
        return

    }

    askbutton.disabled = true
    askbutton.textContent = 'perguntando'
    askbutton.classList.add('loading')
    console.log(aiResponse)

    try {
     const text = await perguntarAI(question, game, apikey)
     aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
     aiResponse.classList.remove('hidden')

     console.log(aiResponse)

    } catch(error) {
       console.log('erro: ', error)
    } finally {
        askbutton.disabled = false
        askbutton.textcontent = "perguntar"
        askbutton.classList.remove('loading')
    }
}


form.addEventListener('submit',  enviarformulario)
