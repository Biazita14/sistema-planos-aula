
# 📚 Sistema de Planos de Aula com Inteligência Artificial

Um sistema Full Stack moderno desenvolvido para auxiliar professores e coordenadores pedagógicos na criação e organização de planos de aula, utilizando Inteligência Artificial para gerar automaticamente sugestões de conteúdos complementares e tags relevantes.

---

## 🚀 Funcionalidades

* **Gerenciamento de Planos:** Criação, listagem e persistência de planos de aula de forma local.
* **Geração Automática com IA:** Integração com o modelo `gemini-2.5-flash` para preenchimento inteligente de conteúdos sugeridos e tags com base no título e disciplina informados.
* **Interface Responsiva:** Tela limpa e dinâmica desenvolvida com React e Tailwind CSS.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

### **Backend**
* **Python**: Linguagem base para a construção das regras de negócio.
* **Flask**: Micro-framework para a criação da API RESTful.
* **SQLite / Flask-SQLAlchemy**: Banco de dados relacional leve para armazenamento local dos planos.
* **Google GenAI SDK**: Nova biblioteca oficial da Google para comunicação direta e otimizada com o Gemini.
* **Python-Dotenv**: Gerenciamento seguro de variáveis de ambiente (proteção de chaves de API).

### **Frontend**
* **React**: Biblioteca para construção da interface de usuário baseada em componentes.
* **Vite**: Ferramenta de build ultra-rápida para o ambiente de desenvolvimento.
* **Tailwind CSS**: Framework utilitário para estilização rápida e moderna.

---

## 🏗️ Como Rodar o Projeto Localmente

### **Pré-requisitos**
Antes de começar, certifique-se de ter instalado em sua máquina:
* Python 3.10 ou superior
* Node.js (gerenciador de pacotes npm)
* Uma chave de API ativa do Google AI Studio

