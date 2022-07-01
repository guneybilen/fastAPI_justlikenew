from passlib.context import CryptContext

hashed_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Hasher:
  
  @staticmethod
  def verify_password(plain_password, hashed_password):
    return hashed_context.verify(plain_password, hashed_password)

  @staticmethod
  def verify_secret_question(plain_secret_question_answer, hashed_secret_question_answer):
    return hashed_context.verify(plain_secret_question_answer, hashed_secret_question_answer)

  @staticmethod
  def get_hash(data):
    return hashed_context.hash(data)

    