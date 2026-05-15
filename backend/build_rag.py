import os
import chromadb
from sentence_transformers import SentenceTransformer

# 初始化
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
client = chromadb.PersistentClient(path="./chroma_db")

# 创建或获取集合
collection = client.get_or_create_collection(name="travel_guide")

def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list:
    """把长文本切成小块"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks

def build_from_folder(folder: str):
    """从文件夹读取所有攻略文件"""
    for filename in os.listdir(folder):
        if not filename.endswith('.txt'):
            continue
        
        city = filename.replace('.txt', '')
        filepath = os.path.join(folder, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 切块
        chunks = chunk_text(content)
        
        # 转向量并存入
        for i, chunk in enumerate(chunks):
            if not chunk.strip():
                continue
            
            embedding = model.encode(chunk).tolist()
            doc_id = f"{city}_{i}"
            
            collection.upsert(
                ids=[doc_id],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[{"city": city, "chunk_index": i}]
            )
        
        print(f"✅ {city} 攻略已导入，共 {len(chunks)} 个块")

if __name__ == "__main__":
    print("开始构建 RAG 知识库...")
    build_from_folder("./rag")
    print("✅ 知识库构建完成！")