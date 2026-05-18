from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class PlanoAula(db.Model):
    __tablename__ = 'planos_aula'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False)
    objetivo = db.Column(db.Text, nullable=False)
    ementa = db.Column(db.Text, nullable=False)
    data_prevista = db.Column(db.Date, nullable=False)
    disciplina = db.Column(db.String(100), nullable=False)
    conteudos = db.Column(db.Text)
    recursos_apoio = db.Column(db.Text)
    tags = db.Column(db.String(200))
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)