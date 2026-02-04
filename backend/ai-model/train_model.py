import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

# Load dataset
data = pd.read_csv("data.csv")

X = data['description']
y_dept = data['department']
y_priority = data['priority']

vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

dept_model = MultinomialNB()
dept_model.fit(X_vec, y_dept)

priority_model = MultinomialNB()
priority_model.fit(X_vec, y_priority)

joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(dept_model, "dept_model.pkl")
joblib.dump(priority_model, "priority_model.pkl")

print("Training complete. Models saved!")
