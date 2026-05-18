from flask import Blueprint, request, jsonify
from .models import db, PlanoAula
from .services import gerar_recomendacoes_ia
from datetime import datetime

main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow()}), 200

@main_bp.route('/planos', methods=['GET'])
def get_planos():
    page = request.args.get('page', 1, type=int)
    disciplina = request.args.get('disciplina')
    titulo = request.args.get('titulo')
    
    query = PlanoAula.query
    
    if disciplina:
        query = query.filter(PlanoAula.disciplina.ilike(f"%{disciplina}%"))
    if titulo:
        query = query.filter(PlanoAula.titulo.ilike(f"%{titulo}%"))
        
    planos_paginados = query.order_by(PlanoAula.data_criacao.desc()).paginate(page=page, per_page=10)
    
    results = []
    for p in planos_paginados.items:
        results.append({
            "id": p.id,
            "titulo": p.titulo,
            "disciplina": p.disciplina,
            "data_prevista": p.data_prevista.strftime('%Y-%m-%d'),
            "tags": p.tags
        })
        
    return jsonify({
        "planos": results,
        "total": planos_paginados.total,
        "pages": planos_paginados.pages,
        "current_page": planos_paginados.page
    })

@main_bp.route('/planos', methods=['POST'])
def create_plano():
    data = request.json
    try:
        novo_plano = PlanoAula(
            titulo=data['titulo'],
            objetivo=data['objetivo'],
            ementa=data['ementa'],
            data_prevista=datetime.strptime(data['data_prevista'], '%Y-%m-%d').date(),
            disciplina=data['disciplina'],
            conteudos=data.get('conteudos'),
            recursos_apoio=data.get('recursos_apoio'),
            tags=data.get('tags')
        )
        db.session.add(novo_plano)
        db.session.commit()
        return jsonify({"message": "Plano criado com sucesso!", "id": novo_plano.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@main_bp.route('/ai/recommend', methods=['POST'])
def ai_recommend():
    data = request.json
    if not data.get('titulo') or not data.get('disciplina'):
        return jsonify({"error": "Título e Disciplina são obrigatórios"}), 400
    
    resultado = gerar_recomendacoes_ia(data['titulo'], data['disciplina'], data.get('ementa', ''))
    if resultado:
        return jsonify(resultado), 200
    else:
        return jsonify({"error": "Falha ao consultar a IA"}), 500