from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import torch
import torch.nn.functional as F

from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
)

from sentence_transformers import SentenceTransformer

import faiss
import pickle

# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="Fake News Detection with RAG",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models"
VECTOR_PATH = BASE_DIR / "vector_db"

# ==========================================================
# Device
# ==========================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(f"Using device: {device}")

# ==========================================================
# Load Tokenizer
# ==========================================================

print("Loading tokenizer...")

tokenizer = BertTokenizer.from_pretrained(
    str(MODEL_PATH)
)

# ==========================================================
# Load BERT Model
# ==========================================================

print("Loading BERT model...")

model = BertForSequenceClassification.from_pretrained(
    str(MODEL_PATH)
)

model.to(device)
model.eval()

print("BERT model loaded successfully.")

# ==========================================================
# Load Sentence Transformer
# ==========================================================

print("Loading embedding model...")

embedding_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

print("Embedding model loaded.")

# ==========================================================
# Load FAISS Index
# ==========================================================

print("Loading FAISS index...")

index = faiss.read_index(
    str(VECTOR_PATH / "faiss_index.bin")
)

with open(
    VECTOR_PATH / "documents.pkl",
    "rb",
) as f:

    documents = pickle.load(f)

print("FAISS loaded.")

# ==========================================================
# Request Model
# ==========================================================

class NewsRequest(BaseModel):
    text: str

# ==========================================================
# Prediction Function
# ==========================================================

def predict_news(news_text: str):

    query_embedding = embedding_model.encode(
        [news_text],
        convert_to_numpy=True,
    )

    distances, indices = index.search(
        query_embedding,
        k=5,
    )

    evidence = []

    for idx in indices[0]:
        evidence.append(str(documents[idx]))

    retrieved_context = "\n".join(evidence)

    enhanced_input = f"""
News Article:
{news_text}

Retrieved Evidence:
{retrieved_context}
"""

    encoding = tokenizer(
        enhanced_input,
        truncation=True,
        padding="max_length",
        max_length=512,
        return_tensors="pt",
    )

    input_ids = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)

    with torch.no_grad():

        outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask,
        )

    probabilities = F.softmax(
        outputs.logits,
        dim=1,
    )

    confidence = torch.max(
        probabilities
    ).item()

    prediction = torch.argmax(
        outputs.logits,
        dim=1,
    ).item()

    label = "Fake" if prediction == 1 else "Real"

    return {
        "prediction": label,
        "confidence": round(confidence * 100, 2),
        "evidence": evidence,
    }

# ==========================================================
# Routes
# ==========================================================

@app.get("/")
def home():

    return {
        "message": "Fake News Detection API Running"
    }

@app.post("/predict")
def predict(request: NewsRequest):

    return predict_news(request.text)
