import { Project } from '../types';

export const featuredProjects: Project[] = [
  {
    id: 'terralis',
    titleKey: 'terralis.title',
    categoryKey: 'terralis.category',
    categoryTag: 'dl',
    descriptionKey: 'terralis.description',
    problemKey: 'terralis.problem',
    approachKey: 'terralis.approach',
    featuresKeys: [
      'terralis.features.0',
      'terralis.features.1',
      'terralis.features.2',
      'terralis.features.3',
      'terralis.features.4'
    ],
    technologies: [
      'Python',
      'PyTorch',
      'TensorFlow',
      'CNN',
      'ResNet50',
      'EfficientNet',
      'MobileNetV3',
      'Streamlit',
      'OpenCV'
    ],
    illustrationType: 'terralis',
    // Placeholders clearly marked
    githubUrl: 'https://github.com/placeholder-repo/satellite-image-classification-terralis',
    demoUrl: 'https://placeholder-terralis-demo.streamlit.app'
  },
  {
    id: 'documind',
    titleKey: 'documind.title',
    categoryKey: 'documind.category',
    categoryTag: 'ai',
    descriptionKey: 'documind.description',
    problemKey: 'documind.problem',
    approachKey: 'documind.approach',
    featuresKeys: [
      'documind.features.0',
      'documind.features.1',
      'documind.features.2',
      'documind.features.3',
      'documind.features.4'
    ],
    technologies: [
      'Python',
      'LangChain',
      'RAG',
      'Sentence Transformers',
      'Vector Databases',
      'Groq API',
      'Streamlit'
    ],
    illustrationType: 'documind',
    githubUrl: 'https://github.com/placeholder-repo/documind-intelligent-pdf-assistant',
    demoUrl: 'https://placeholder-documind-demo.streamlit.app'
  },
  {
    id: 'mlstudio',
    titleKey: 'mlstudio.title',
    categoryKey: 'mlstudio.category',
    categoryTag: 'ml',
    descriptionKey: 'mlstudio.description',
    problemKey: 'mlstudio.problem',
    approachKey: 'mlstudio.approach',
    featuresKeys: [
      'mlstudio.features.0',
      'mlstudio.features.1',
      'mlstudio.features.2',
      'mlstudio.features.3',
      'mlstudio.features.4'
    ],
    technologies: [
      'Python',
      'Streamlit',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'Plotly',
      'Feature Engineering'
    ],
    illustrationType: 'mlstudio',
    githubUrl: 'https://github.com/placeholder-repo/machine-learning-studio-interactive',
    demoUrl: 'https://placeholder-mlstudio-demo.streamlit.app'
  },
  {
    id: 'sales',
    titleKey: 'sales.title',
    categoryKey: 'sales.category',
    categoryTag: 'analytics',
    descriptionKey: 'sales.description',
    problemKey: 'sales.problem',
    approachKey: 'sales.approach',
    featuresKeys: [
      'sales.features.0',
      'sales.features.1',
      'sales.features.2',
      'sales.features.3',
      'sales.features.4'
    ],
    technologies: [
      'Power BI',
      'Power Query',
      'DAX',
      'Data Modeling',
      'Business Intelligence'
    ],
    illustrationType: 'sales',
    githubUrl: 'https://github.com/placeholder-repo/powerbi-sales-operations-analytics',
    demoUrl: 'https://placeholder-powerbi-sales-operations.preview'
  },
  {
    id: 'healthcare',
    titleKey: 'healthcare.title',
    categoryKey: 'healthcare.category',
    categoryTag: 'analytics',
    descriptionKey: 'healthcare.description',
    problemKey: 'healthcare.problem',
    approachKey: 'healthcare.approach',
    featuresKeys: [
      'healthcare.features.0',
      'healthcare.features.1',
      'healthcare.features.2',
      'healthcare.features.3',
      'healthcare.features.4'
    ],
    technologies: [
      'Power BI',
      'Power Query',
      'DAX',
      'Clinical KPIs',
      'Healthcare Analytics'
    ],
    illustrationType: 'healthcare',
    githubUrl: 'https://github.com/placeholder-repo/powerbi-healthcare-emergency-analytics',
    demoUrl: 'https://placeholder-powerbi-emergency-healthcare.preview'
  }
];
