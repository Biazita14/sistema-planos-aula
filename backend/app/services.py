import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

def gerar_recomendacoes_ia(titulo, disciplina, ementa):
    try:
        # Inicializa o cliente novo com a chave do .env
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        prompt_sistema = (
            "Você é um Assistente Pedagógico especializado em planejamento de aulas. "
            "Sua tarefa é sugerir conteúdos complementares e tags para o plano de aula. "
            "Responda OBRIGATORIAMENTE em formato JSON com as seguintes chaves: "
            "'conteudos_complementares' (string), 'topicos_relacionados' (lista de strings) "
            "e 'tags' (lista de 3 strings)."
        )
        
        prompt_usuario = f"Aula de {disciplina} com o título '{titulo}'. Ementa: {ementa}"
        
        # Usando o modelo atualizado gemini-2.5-flash para evitar o erro 404 de rota
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_usuario,
            config=types.GenerateContentConfig(
                system_instruction=prompt_sistema,
                response_mime_type="application/json"
            ),
        )
        
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Erro na IA (Gemini Novo): {e}")
        return None