import os
import json
from openai import OpenAI

def gerar_recomendacoes_ia(titulo, disciplina, ementa):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    prompt_sistema = (
        "Você é um Assistente Pedagógico especializado em planejamento de aulas. "
        "Sua tarefa é sugerir conteúdos complementares e tags para o plano de aula. "
        "Responda OBRIGATORIAMENTE em formato JSON com as seguintes chaves: "
        "'conteudos_complementares' (string), 'topicos_relacionados' (lista de strings) "
        "e 'tags' (lista de 3 strings)."
    )
    
    prompt_usuario = f"Aula de {disciplina} com o título '{titulo}'. Ementa: {ementa}"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": prompt_usuario}
            ],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Erro na IA: {e}")
        return None