import { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming-data',
    titleKey: 'cat1Title',
    descriptionKey: 'cat1Desc',
    icon: 'Code2',
    skills: [
      'Python',
      'SQL',
      'Pandas',
      'NumPy',
      'SciPy'
    ]
  },
  {
    id: 'machine-learning',
    titleKey: 'cat2Title',
    descriptionKey: 'cat2Desc',
    icon: 'Brain',
    skills: [
      'Scikit-learn',
      'Linear Regression',
      'Logistic Regression',
      'Decision Trees',
      'Random Forest',
      'XGBoost',
      'SVM',
      'KNN',
      'Feature Engineering',
      'Model Evaluation'
    ]
  },
  {
    id: 'deep-learning-cv',
    titleKey: 'cat3Title',
    descriptionKey: 'cat3Desc',
    icon: 'Eye',
    skills: [
      'PyTorch',
      'TensorFlow',
      'Keras',
      'CNN',
      'Transfer Learning',
      'ResNet50',
      'EfficientNet',
      'MobileNetV3',
      'YOLOv8',
      'OpenCV'
    ]
  },
  {
    id: 'genai-llm',
    titleKey: 'cat4Title',
    descriptionKey: 'cat4Desc',
    icon: 'Bot',
    skills: [
      'Large Language Models',
      'Retrieval-Augmented Generation (RAG)',
      'LangChain',
      'Hugging Face',
      'Sentence Transformers',
      'Embeddings',
      'Vector Databases',
      'Prompt Engineering',
      'Groq API'
    ]
  },
  {
    id: 'data-analytics',
    titleKey: 'cat5Title',
    descriptionKey: 'cat5Desc',
    icon: 'BarChart3',
    skills: [
      'Power BI',
      'Power Query',
      'DAX',
      'Matplotlib',
      'Seaborn',
      'Plotly',
      'Exploratory Data Analysis'
    ]
  },
  {
    id: 'dev-databases',
    titleKey: 'cat6Title',
    descriptionKey: 'cat6Desc',
    icon: 'Database',
    skills: [
      'FastAPI',
      'Flask',
      'Streamlit',
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Git',
      'GitHub',
      'Docker'
    ]
  }
];
