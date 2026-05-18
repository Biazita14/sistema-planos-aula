import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export default function App() {
  // Estados para a listagem
  const [planos, setPlanos] = useState([]);
  const [buscaTitulo, setBuscaTitulo] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estados do Formulário
  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [ementa, setEmenta] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');
  const [conteudos, setConteudos] = useState('');
  const [recursosApoio, setRecursosApoio] = useState('');
  const [tags, setTags] = useState('');

  // Estados de feedback visual
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState('');

  // Buscar planos do backend
  const buscarPlanos = async () => {
    try {
      const response = await axios.get(`${API_URL}/planos`, {
        params: { page: pagina, titulo: buscaTitulo, disciplina: filtroDisciplina }
      });
      setPlanos(response.data.planos);
      setTotalPaginas(response.data.pages);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    }
  };

  useEffect(() => {
    buscarPlanos();
  }, [pagina, buscaTitulo, filtroDisciplina]);

  // Função para chamar a IA
  const gerarRecomendacoes = async () => {
    if (!titulo || !disciplina) {
      alert("Por favor, preencha o Título e a Disciplina antes de chamar a IA.");
      return;
    }

    setCarregandoIA(true);
    setErroIA('');

    try {
      const response = await axios.post(`${API_URL}/ai/recommend`, {
        titulo,
        disciplina,
        ementa
      });

      setConteudos(response.data.conteudos_complementares);
      
      if (response.data.topicos_relacionados) {
        setRecursosApoio(`Tópicos sugeridos: ${response.data.topicos_relacionados.join(', ')}`);
      }
      
      if (response.data.tags) {
        setTags(response.data.tags.join(', '));
      }

    } catch (error) {
      setErroIA('Ocorreu um erro ou a IA demorou muito para responder. Tente novamente.');
    } finally {
      setCarregandoIA(false);
    }
  };

  // Salvar o plano de aula no banco
  const salvarPlano = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/planos`, {
        titulo, disciplina, objetivo, ementa,
        data_prevista: dataPrevista, conteudos, recursos_apoio: recursosApoio, tags
      });
      alert("Plano de Aula salvo com sucesso!");
      setTitulo(''); setDisciplina(''); setObjetivo(''); setEmenta('');
      setDataPrevista(''); setConteudos(''); setRecursosApoio(''); setTags('');
      buscarPlanos();
    } catch (error) {
      alert("Erro ao salvar o plano de aula.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-8 border-b pb-4 text-center">
        <h1 className="text-3xl font-bold text-blue-600">SmartClass - Gestor de Planos de Aula</h1>
        <p className="text-gray-500">Planejamento pedagógico turbinado com Inteligência Artificial</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Formulário de Cadastro */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Novo Plano de Aula</h2>
          <form onSubmit={salvarPlano} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Título da Aula *</label>
                <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Disciplina *</label>
                <input type="text" value={disciplina} onChange={e => setDisciplina(e.target.value)} required className="w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Objetivo da Aula *</label>
              <textarea value={objetivo} onChange={e => setObjetivo(e.target.value)} required className="w-full rounded-md border p-2 h-16" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Ementa / Resumo</label>
              <textarea value={ementa} onChange={e => setEmenta(e.target.value)} className="w-full rounded-md border p-2 h-16" />
            </div>

            <div className="flex items-center justify-between border-t border-b py-3">
              <span className="text-sm text-gray-500">Precisa de ideias? Deixe a IA te ajudar:</span>
              <button type="button" onClick={gerarRecomendacoes} disabled={carregandoIA} className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:bg-purple-300">
                {carregandoIA ? "🧠 Pensando..." : "✨ Gerar Recomendações com IA"}
              </button>
            </div>

            {/* Feedback de Erro da IA */}
            {erroIA && <p className="text-sm text-red-500">{erroIA}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-600">Conteúdos Sugeridos</label>
              <textarea value={conteudos} onChange={e => setConteudos(e.target.value)} className="w-full rounded-md border p-2 h-20 bg-purple-50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Recursos de Apoio</label>
                <input type="text" value={recursosApoio} onChange={e => setRecursosApoio(e.target.value)} className="w-full rounded-md border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Data Prevista *</label>
                <input type="date" value={dataPrevista} onChange={e => setDataPrevista(e.target.value)} required className="w-full rounded-md border p-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Tags (Separadas por vírgula)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Ex: Algoritmos, Prática, IA" className="w-full rounded-md border p-2" />
            </div>

            <button type="submit" className="w-full rounded-md bg-blue-600 p-3 font-bold text-white hover:bg-blue-700">
              Salvar Plano de Aula
            </button>
          </form>
        </div>

        {/* Listagem e Filtros */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Planos de Aula Cadastrados</h2>
          
          {/* Filtros */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <input type="text" placeholder="Buscar por título..." value={buscaTitulo} onChange={e => setBuscaTitulo(e.target.value)} className="rounded-md border p-2 text-sm" />
            <input type="text" placeholder="Filtrar por disciplina..." value={filtroDisciplina} onChange={e => setFiltroDisciplina(e.target.value)} className="rounded-md border p-2 text-sm" />
          </div>

          {/* Lista */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {planos.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Nenhum plano de aula encontrado.</p>
            ) : (
              planos.map(plano => (
                <div key={plano.id} className="rounded-lg border p-4 hover:shadow-sm bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">{plano.titulo}</h3>
                      <p className="text-sm text-blue-500 font-medium">{plano.disciplina}</p>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">{plano.data_prevista}</span>
                  </div>
                  {plano.tags && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {plano.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
              <span className="text-sm self-center">Página {pagina} de {totalPaginas}</span>
              <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Próxima</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}