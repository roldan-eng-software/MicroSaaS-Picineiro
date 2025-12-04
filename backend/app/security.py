import bcrypt # Importar a biblioteca bcrypt diretamente

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # bcrypt.checkpw espera bytes, então encode a senha simples e o hash
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    # bcrypt.hashpw espera bytes e retorna bytes
    # Gerar um salt (com custo padrão de 12 rounds) e então hash
    hashed_password_bytes = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    # Decodificar o hash de bytes para string para armazenar no banco de dados
    return hashed_password_bytes.decode('utf-8')