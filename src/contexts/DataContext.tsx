import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ProfileRecord, 
  ProjectRecord, 
  SkillCategoryRecord, 
  SkillRecord, 
  EducationRecord, 
  SocialLinkRecord, 
  SiteSettingsRecord, 
  ContactMessageRecord,
  CVDownloadEvent,
  PageViewEvent
} from '../types';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getOrCreateVisitorId } from '../lib/visitor';

// -------------------------------------------------------------
// INITIAL SEED DATA (Used when Supabase is loading or offline)
// -------------------------------------------------------------
const INITIAL_PROFILE: ProfileRecord = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Abderrahman El Harakani',
  email: 'contact.abderrahman.placeholder@example.com',
  avatar_url: '/images/profile.jpg',
  title_en: 'Data Scientist & AI Engineer',
  title_fr: 'Data Scientist & Ingénieur IA',
  title_ar: 'عالم بيانات ومهندس ذكاء اصطناعي',
  role_tagline_en: 'Building Intelligent Solutions.',
  role_tagline_fr: 'Développant des Solutions Intelligentes.',
  role_tagline_ar: 'أطور حلولاً ذكية ومبتكرة.',
  location_en: 'Morocco',
  location_fr: 'Maroc',
  location_ar: 'المملكة المغربية',
  short_bio_en: "I'm a Data Science Master's student passionate about Artificial Intelligence, Machine Learning, and Data Analytics. I transform complex data into meaningful insights and build intelligent applications that solve real-world problems.",
  short_bio_fr: "Étudiant en 2ème année de Master Data Science, passionné par l'Intelligence Artificielle, le Machine Learning et la Data Analytics. Je transforme les données complexes en insights exploitables et conçois des applications intelligentes pour résoudre des problèmes concrets.",
  short_bio_ar: "طالب ماستر في علوم البيانات، شغوف بالذكاء الاصطناعي وتعلم الآلة وتحليل البيانات. أعمل على تحويل البيانات المعقدة إلى رؤى قيّمة وبناء تطبيقات ذكية تعالج تحديات واقعية.",
  detailed_bio_en: "I'm currently pursuing the second year of a Master's degree in Data Science at École Normale Supérieure (ENS) in Tétouan, Morocco.\n\nMy interests lie at the intersection of Data Science and Artificial Intelligence. I work on predictive modeling, Deep Learning, Computer Vision, Generative AI, and Data Analytics.\n\nI enjoy developing complete solutions, from data collection and preprocessing to model development, evaluation, deployment, and interactive applications.\n\nI'm continuously learning and exploring emerging technologies to turn theoretical knowledge into practical solutions.",
  detailed_bio_fr: "Je poursuis actuellement la deuxième année d'un Master en Data Science à l'École Normale Supérieure (ENS) de Tétouan, au Maroc.\n\nMes centres d'intérêt se situent à l'intersection de la Data Science et de l'Intelligence Artificielle. Je travaille sur la modélisation prédictive, le Deep Learning, la Computer Vision, l'IA Générative et la Data Analytics.\n\nJ'aime développer des solutions de bout en bout, de la collecte et du prétraitement des données jusqu'au développement, à l'évaluation, au déploiement et à la création d'applications interactives.\n\nJ'approfondis continuellement mes compétences et explore les technologies émergentes pour transformer le savoir théorique en réalisations concrètes.",
  detailed_bio_ar: "أتابع حالياً دراستي في السنة الثانية من سلك الماستر في علوم البيانات بالمدرسة العليا للأساتذة (ENS) بتطوان، المغرب.\n\nتتركز اهتماماتي في نقطة التقاء علوم البيانات والذكاء الاصطناعي، حيث أعمل على النمذجة التنبؤية، التعلم العميق، الرؤية الحاسوبية، الذكاء الاصطناعي التوليدي، وتحليلات البيانات.\n\nأستمتع بتطوير حلول متكاملة وشاملة، بدءاً من جمع البيانات ومعالجتها الأولية، مروراً بتطوير النماذج وتقييمها، وصولاً إلى نشرها وبناء تطبيقات تفاعلية فعالة.\n\nأحرص دائماً على مواصلة التعلم واستكشاف التقنيات الصاعدة لتحويل المعارف النظرية إلى حلول تطبيقية تخدم الواقع.",
  pfe_badge_en: 'OPEN TO PFE OPPORTUNITIES – 2027',
  pfe_badge_fr: 'OUVERT AUX OPPORTUNITÉS PFE – 2027',
  pfe_badge_ar: 'متاح لفرص تدريب نهاية الدراسة (PFE) – 2027',
  availability_status: 'Available for 4–6 month PFE Internship',
};

const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 'terralis',
    category_tag: 'dl',
    title_en: 'Satellite Image Classification – TERRALIS',
    title_fr: "Classification d'Images Satellitaires – TERRALIS",
    title_ar: 'تصنيف صور الأقمار الصناعية – TERRALIS',
    category_en: 'Deep Learning / Computer Vision',
    category_fr: 'Deep Learning / Computer Vision',
    category_ar: 'التعلم العميق / الرؤية الحاسوبية',
    description_en: 'A satellite image classification project using Sentinel-2 imagery and the EuroSAT dataset, containing approximately 27,000 images across 10 land-use and land-cover classes.',
    description_fr: "Un projet de classification d'images satellitaires basé sur l'imagerie Sentinel-2 et le jeu de données EuroSAT, comprenant environ 27 000 images réparties sur 10 classes.",
    description_ar: 'مشروع متقدم لتصنيف صور الأقمار الصناعية بالاعتماد على صور Sentinel-2 ومجموعة بيانات EuroSAT التي تحتوي على نحو 27,000 صورة موزعة على 10 أصناف.',
    problem_en: 'Automating land-use and land-cover classification from high-resolution satellite imagery across diverse European terrestrial topographies.',
    problem_fr: "Automatiser l'identification et la classification de l'occupation des sols à partir d'images satellitaires haute résolution.",
    problem_ar: 'أتمتة تصنيف وتحديد استخدامات الأراضي والغطاء الأرضي بدقة عالية من صور الأقمار الصناعية عبر تضاريس جغرافية متعددة.',
    approach_en: 'Applied transfer learning benchmarks comparing ResNet50, EfficientNet-B0, and MobileNetV3 with rigorous preprocessing and deployed into a real-time Streamlit web app.',
    approach_fr: 'Application de techniques de Transfer Learning avec benchmark comparatif entre ResNet50, EfficientNet-B0 et MobileNetV3.',
    approach_ar: 'تطبيق التعلم بالنقل (Transfer Learning) مع مقارنة معيارية شاملة بين ResNet50 و EfficientNet-B0 و MobileNetV3.',
    features_en: [
      'Transfer Learning implementation',
      'Empirical benchmark of ResNet50, EfficientNet-B0, and MobileNetV3',
      'Robust multispectral image preprocessing pipeline',
      'Comprehensive model evaluation & confusion matrix metrics',
      'Interactive inference dashboard integrated in Streamlit'
    ],
    features_fr: [
      'Mise en œuvre du Transfer Learning',
      'Comparaison empirique de ResNet50, EfficientNet-B0 et MobileNetV3',
      "Pipeline robuste de prétraitement d'images multispectrales",
      'Évaluation complète des modèles et matrice de confusion',
      "Interface web interactive d'inférence développée avec Streamlit"
    ],
    features_ar: [
      'تطبيق تقنيات التعلم بالنقل',
      'مقارنة معيارية دقيقة بين نماذج ResNet50 و EfficientNet-B0 و MobileNetV3',
      'مسار متكامل لمعالجة الصور متعددة الأطياف',
      'تقييم شامل للنماذج وتحليل دقيق لمصفوفة الالتباس',
      'تطبيق تفاعلي للاستدلال السريع تم بناؤه باستخدام Streamlit'
    ],
    technologies: ['Python', 'PyTorch', 'TensorFlow', 'CNN', 'ResNet50', 'EfficientNet', 'MobileNetV3', 'Streamlit', 'OpenCV'],
    illustration_type: 'terralis',
    github_url: 'https://github.com/placeholder-repo/satellite-image-classification-terralis',
    demo_url: 'https://placeholder-terralis-demo.streamlit.app',
    display_order: 1,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'documind',
    category_tag: 'ai',
    title_en: 'DocuMind AI – Intelligent PDF Assistant',
    title_fr: 'DocuMind AI – Assistant PDF Intelligent',
    title_ar: 'DocuMind AI – المساعد الذكي لمستندات PDF',
    category_en: 'Artificial Intelligence / Generative AI',
    category_fr: 'Intelligence Artificielle / IA Générative',
    category_ar: 'الذكاء الاصطناعي / الذكاء الاصطناعي التوليدي',
    description_en: 'An intelligent document question-answering application based on Retrieval-Augmented Generation.',
    description_fr: 'Une application intelligente de questions-réponses sur documents PDF reposant sur le Retrieval-Augmented Generation (RAG).',
    description_ar: 'تطبيق ذكي للإجابة عن التساؤلات المستندة إلى ملفات PDF بالاعتماد على تقنية التوليد المعزز بالاسترجاع (RAG).',
    problem_en: 'Overcoming static PDF reading limitations by enabling contextual, semantic querying across dense technical documents without hallucinations.',
    problem_fr: 'Dépasser les limites de la lecture statique des documents PDF complexes en permettant des requêtes contextuelles sans hallucinations.',
    problem_ar: 'تجاوز قيود القراءة التقليدية للمستندات التقنية والأكاديمية من خلال إتاحة الاستعلام الدلالي دون الوقوع في هلوسة النماذج.',
    approach_en: 'Built a production-grade RAG pipeline using LangChain, semantic chunking, Sentence Transformers embeddings, vector storage, and high-speed Groq API LLM inference.',
    approach_fr: 'Architecture RAG complète utilisant LangChain, découpage sémantique, vectorisation avec Sentence Transformers et inférence ultra-rapide avec Groq API.',
    approach_ar: 'بناء بنية RAG متكاملة بالاعتماد على LangChain، التقطيع الدلالي، تضمينات Sentence Transformers، والاستعانة بـ Groq API.',
    features_en: [
      'Automated PDF extraction and clean text chunking',
      'Dense semantic embeddings with Sentence Transformers',
      'Vector-based similarity retrieval and reranking',
      'Contextual, grounded question answering with citations',
      'High-performance Groq API integration for sub-second responses'
    ],
    features_fr: [
      'Extraction automatisée de PDF et segmentation textuelle sémantique',
      "Génération d'embeddings denses avec Sentence Transformers",
      'Recherche par similarité vectorielle et reclassement des passages',
      'Réponses contextuelles précises et étayées par des citations',
      "Intégration de l'API Groq pour un temps de réponse sub-seconde"
    ],
    features_ar: [
      'استخراج آلي للنصوص وتقطيع سياقي دلالي محكم',
      'إنشاء تضمينات دلالية مكثفة باستخدام Sentence Transformers',
      'استرجاع البيانات القائم على التشابه الاتجاهي',
      'إجابات سياقية دقيقة وموثقة بالإحالات المباشرة داخل المستند',
      'تكامل مع Groq API لتحقيق زمن استجابة سريع للغاية'
    ],
    technologies: ['Python', 'LangChain', 'RAG', 'Sentence Transformers', 'Vector Databases', 'Groq API', 'Streamlit'],
    illustration_type: 'documind',
    github_url: 'https://github.com/placeholder-repo/documind-intelligent-pdf-assistant',
    demo_url: 'https://placeholder-documind-demo.streamlit.app',
    display_order: 2,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'mlstudio',
    category_tag: 'ml',
    title_en: 'Machine Learning Studio – Interactive ML Platform',
    title_fr: 'Machine Learning Studio – Plateforme ML Interactive',
    title_ar: 'Machine Learning Studio – منصة تفاعلية لتعلم الآلة',
    category_en: 'Machine Learning',
    category_fr: 'Machine Learning',
    category_ar: 'تعلم الآلة',
    description_en: 'An interactive application designed to simplify Machine Learning workflows.',
    description_fr: 'Une application interactive conçue pour simplifier et accélérer les flux de travail en Machine Learning.',
    description_ar: 'تطبيق ويب تفاعلي صُمم لتبسيط وتسريع مسارات عمل تعلم الآلة من البداية وحتى التقييم.',
    problem_en: 'Complex, code-heavy modeling pipelines create bottlenecks for rapid experimentation, exploratory analysis, and quick algorithm comparison.',
    problem_fr: "La création manuelle de scripts pour l'exploration et les tests de modèles ralentit l'expérimentation rapide.",
    problem_ar: 'الحاجة إلى كتابة أكواد متكررة عند استكشاف البيانات واختبار النماذج مما يعيق وتيرة التجريب السريع للمختصين.',
    approach_en: 'Developed an end-to-end interactive platform in Streamlit featuring automated EDA, dynamic correlation heatmaps, one-click preprocessing, and multi-model training/evaluation.',
    approach_fr: 'Développement d’une plateforme Streamlit complète intégrant EDA automatique, matrices de corrélation dynamiques et prétraitement en un clic.',
    approach_ar: 'تطوير منصة شاملة عبر Streamlit تقدم تحليلاً استكشافياً تلقائياً، مصفوفات ارتباط تفاعلية، ومعالجة مسبقة بنقرة واحدة.',
    features_en: [
      'Seamless CSV dataset upload & schema parsing',
      'Automated exploratory data analysis with Plotly visualizations',
      'Interactive correlation matrices and distribution plots',
      'Automated feature encoding and missing value imputation',
      'Multi-model training with comparative accuracy, precision, and recall metrics'
    ],
    features_fr: [
      'Importation fluide de jeux de données CSV et détection de schéma',
      'Analyse exploratoire automatisée avec visualisations Plotly',
      'Matrices de corrélation et graphiques de distribution interactifs',
      'Prétraitement automatique (encodage et gestion des valeurs manquantes)',
      'Entraînement simultané de plusieurs modèles avec comparaison des métriques'
    ],
    features_ar: [
      'رفع مجموعات بيانات CSV والتعرف التلقائي على المخطط والأنواع',
      'تحليل استكشافي مؤتمت للبيانات عبر رسوم Plotly التفاعلية',
      'مصفوفات ارتباط ديناميكية ومخططات توزيع إحصائية',
      'معالجة البيانات تلقائياً (الترميز والتعامل مع القيم المفقودة)',
      'تدريب متزامن لنماذج متعددة مع مقارنة شاملة لمعايير الدقة'
    ],
    technologies: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'NumPy', 'Plotly', 'Feature Engineering'],
    illustration_type: 'mlstudio',
    github_url: 'https://github.com/placeholder-repo/machine-learning-studio-interactive',
    demo_url: 'https://placeholder-mlstudio-demo.streamlit.app',
    display_order: 3,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'sales',
    category_tag: 'analytics',
    title_en: 'Sales & Operations Analytics Dashboard',
    title_fr: 'Tableau de Bord Ventes & Opérations',
    title_ar: 'لوحة معلومات تحليلات المبيعات والعمليات',
    category_en: 'Data Analytics',
    category_fr: 'Data Analytics',
    category_ar: 'تحليل البيانات',
    description_en: 'An interactive Power BI dashboard designed to analyze business performance and operational metrics.',
    description_fr: 'Un tableau de bord interactif Power BI conçu pour analyser la performance commerciale et les indicateurs opérationnels.',
    description_ar: 'لوحة معلومات تفاعلية في Power BI صُممت لتحليل الأداء التجاري والعمليات التشغيلية بدقة متناهية.',
    problem_en: 'Disparate business data sources made it difficult to gain real-time visibility into sales trends, regional distribution, and supply operations.',
    problem_fr: "La dispersion des données d'entreprise entravait le suivi en temps réel de la croissance des ventes et de la rentabilité.",
    problem_ar: 'تشتت بيانات العمليات والمبيعات داخل المؤسسة مما صعب متابعة النمو اللحظي وكفاءة سلاسل الإمداد ومؤشرات الربحية.',
    approach_en: 'Engineered robust star-schema data models in Power Query, crafted DAX measures for year-over-year revenue velocity, and built intuitive multi-tier executive dashboards.',
    approach_fr: 'Modélisation de données en schéma en étoile sous Power Query, élaboration de mesures DAX avancées (croissance N/N-1, marges).',
    approach_ar: 'تصميم نموذج بيانات سليم بنمط المخطط النجمي في Power Query، وبناء دوال DAX متقدمة لمعدلات النمو والربحية.',
    features_en: [
      'Core revenue, margin, and volume sales KPIs',
      'Product category performance and basket breakdown',
      'Geographic performance heatmaps and market penetration views',
      'Operational efficiency and fulfillment bottleneck tracking',
      'Fully interactive cross-filtering and drill-through navigation'
    ],
    features_fr: [
      "KPIs fondamentaux de chiffre d'affaires, marge brute et volumes",
      'Analyse détaillée des performances par catégorie de produits',
      'Cartographie géographique interactive et taux de pénétration',
      'Suivi opérationnel et détection des goulots d’étranglement logistiques',
      'Filtrage croisé interactif et exploration hiérarchique détaillée'
    ],
    features_ar: [
      'مؤشرات الأداء الرئيسية للإيرادات وهوامش الربح وحجم المبيعات',
      'تحليل تفصيلي لأداء فئات المنتجات ومصفوفة المشتريات',
      'خرائط جغرافية تفاعلية لمعدلات الانتشار في الأسواق',
      'مراقبة الكفاءة التشغيلية ورصد اختناقات الإمداد والتنفيذ',
      'تصفية تفاعلية متزامنة وتعمق في تفاصيل المستويات المختلفة'
    ],
    technologies: ['Power BI', 'Power Query', 'DAX', 'Data Modeling', 'Business Intelligence'],
    illustration_type: 'sales',
    github_url: 'https://github.com/placeholder-repo/powerbi-sales-operations-analytics',
    demo_url: 'https://placeholder-powerbi-sales-operations.preview',
    display_order: 4,
    is_featured: true,
    is_published: true,
  },
  {
    id: 'healthcare',
    category_tag: 'analytics',
    title_en: 'Healthcare Emergency Analytics Dashboard',
    title_fr: 'Tableau de Bord Analytique des Urgences Hospitalières',
    title_ar: 'لوحة تحليلات طوارئ الرعاية الصحية',
    category_en: 'Data Analytics',
    category_fr: 'Data Analytics',
    category_ar: 'تحليل البيانات',
    description_en: 'A healthcare analytics dashboard focused on emergency department performance.',
    description_fr: 'Un tableau de bord analytique appliqué au secteur de la santé, focalisé sur la performance des services d’urgences.',
    description_ar: 'لوحة تحليلات تطبيقية في قطاع الرعاية الصحية تركز على مراقبة أداء أقسام الطوارئ وسير تدفق المرضى.',
    problem_en: 'Emergency departments face overcrowding and unpredictable patient flows that challenge resource allocation and increase waiting times.',
    problem_fr: "La saturation des services d'urgence et la variabilité des flux de patients compliquent la planification des effectifs.",
    problem_ar: 'التدفق غير المنتظم للمرضى على أقسام الطوارئ يضغط على الكوادر الطبية والموارد ويزيد من فترات الانتظار الحرجة.',
    approach_en: 'Transformed historical triage and admissions records into an analytical Power BI suite tracking critical patient flow bottlenecks and clinician capacity.',
    approach_fr: "Traitement des flux d'admissions et de triage dans Power BI pour identifier les facteurs d'attente et optimiser la rotation des lits.",
    approach_ar: 'معالجة بيانات الفرز والتسجيل في Power BI لتحليل مسببات التأخير، تتبع السعة السريرية، والتنبؤ بأوقات الذروة الاستشفائية.',
    features_en: [
      'Emergency department admission trends and triage severity tracking',
      'Patient waiting-time monitoring against clinical SLA thresholds',
      'Healthcare operational performance and bed-turnover indicators',
      'Peak-hour admissions forecasting and shift-level workload insights',
      'Granular patient demographic and departmental drill-down views'
    ],
    features_fr: [
      "Analyse des admissions aux urgences et classification de gravité du triage",
      "Surveillance des temps d'attente des patients par rapport aux seuils cliniques",
      'Indicateurs de performance opérationnelle et de rotation des lits',
      'Détection des heures de pointe et analyse de la charge de travail',
      'Vues analytiques détaillées par typologie de patients et spécialités'
    ],
    features_ar: [
      'تحليل اتجاهات دخول الطوارئ ودرجات خطورة الفرز الطبي',
      'مراقبة أوقات انتظار المرضى وفق المعايير الطبية المعتمدة',
      'مؤشرات الأداء التشغيلي ومعدلات تدوير وإشغال الأسرة',
      'رصد ساعات الذروة وتحليل توزيع أعباء العمل على الطواقم الطبية',
      'طرق عرض تحليلية مفصلة حسب الشرائح السكانية والتخصصات'
    ],
    technologies: ['Power BI', 'Power Query', 'DAX', 'Clinical KPIs', 'Healthcare Analytics'],
    illustration_type: 'healthcare',
    github_url: 'https://github.com/placeholder-repo/powerbi-healthcare-emergency-analytics',
    demo_url: 'https://placeholder-powerbi-emergency-healthcare.preview',
    display_order: 5,
    is_featured: true,
    is_published: true,
  }
];

const INITIAL_CATEGORIES: SkillCategoryRecord[] = [
  {
    id: 'programming-data',
    title_en: 'Programming & Data Processing',
    title_fr: 'Programmation & Traitement des Données',
    title_ar: 'البرمجة ومعالجة البيانات',
    description_en: 'Core languages and quantitative computing libraries for data manipulation and statistical processing.',
    description_fr: 'Langages clés et bibliothèques de calcul quantitatif pour la manipulation de données et le calcul statistique.',
    description_ar: 'لغات البرمجة الأساسية ومكتبات الحوسبة الكمية للتعامل مع البيانات والعمليات الإحصائية.',
    icon: 'Code2',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'machine-learning',
    title_en: 'Machine Learning',
    title_fr: 'Machine Learning',
    title_ar: 'تعلم الآلة (Machine Learning)',
    description_en: 'Supervised and unsupervised algorithms, feature engineering, and robust model evaluation pipelines.',
    description_fr: 'Algorithmes supervisés et non supervisés, ingénierie des variables et pipelines d’évaluation rigoureux.',
    description_ar: 'الخوارزميات الخاضعة للإشراف وغير الخاضعة للإشراف، هندسة الخصائص، ومسارات التقييم الدقيقة.',
    icon: 'Brain',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'deep-learning-cv',
    title_en: 'Deep Learning & Computer Vision',
    title_fr: 'Deep Learning & Computer Vision',
    title_ar: 'التعلم العميق والرؤية الحاسوبية',
    description_en: 'Neural architectures, transfer learning, image feature extraction, and real-time computer vision.',
    description_fr: 'Architectures neuronales, transfer learning, extraction de caractéristiques visuelles et vision par ordinateur.',
    description_ar: 'البنى العصبية، التعلم بالنقل، استخراج السمات البصرية، والرؤية الحاسوبية اللحظية.',
    icon: 'Eye',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'genai-llm',
    title_en: 'Generative AI & LLM Engineering',
    title_fr: 'IA Générative & Ingénierie LLM',
    title_ar: 'الذكاء الاصطناعي التوليدي وهندسة LLM',
    description_en: 'Retrieval-Augmented Generation (RAG), vector embeddings, agentic workflows, and fast LLM inference.',
    description_fr: 'Architectures RAG, embeddings vectoriels, orchestration d’agents et inférence accélérée de LLMs.',
    description_ar: 'بنى RAG، التضمينات المتجهة (Embeddings)، تدفقات الوكلاء الأذكياء، والاستدلال الفائق السرعة.',
    icon: 'Bot',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'data-analytics',
    title_en: 'Data Analytics & Visualization',
    title_fr: 'Data Analytics & Visualisation',
    title_ar: 'تحليل البيانات والتصور البصري',
    description_en: 'Exploratory data analysis, interactive business intelligence dashboards, and visual storytelling.',
    description_fr: 'Analyse exploratoire des données, tableaux de bord décisionnels interactifs et narration visuelle des métriques.',
    description_ar: 'التحليل الاستكشافي للبيانات، لوحات معلومات ذكاء الأعمال التفاعلية، والتمثيل البياني المتقدم.',
    icon: 'BarChart3',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'dev-databases',
    title_en: 'Development & Databases',
    title_fr: 'Développement & Bases de Données',
    title_ar: 'التطوير وقواعد البيانات',
    description_en: 'Modern API frameworks, relational and NoSQL databases, containerization, and version control.',
    description_fr: 'Frameworks d’API modernes, bases relationnelles et NoSQL, conteneurisation et contrôle de versions.',
    description_ar: 'أطر عمل الويب السريعة، قواعد البيانات العلائقية وغير العلائقية، الحاويات وإدارة الإصدارات.',
    icon: 'Database',
    display_order: 6,
    is_active: true,
  }
];

const INITIAL_SKILLS: SkillRecord[] = [
  // Programming & Data
  { id: '1', category_id: 'programming-data', name: 'Python', display_order: 1, is_active: true },
  { id: '2', category_id: 'programming-data', name: 'SQL', display_order: 2, is_active: true },
  { id: '3', category_id: 'programming-data', name: 'Pandas', display_order: 3, is_active: true },
  { id: '4', category_id: 'programming-data', name: 'NumPy', display_order: 4, is_active: true },
  { id: '5', category_id: 'programming-data', name: 'SciPy', display_order: 5, is_active: true },
  // ML
  { id: '6', category_id: 'machine-learning', name: 'Scikit-learn', display_order: 1, is_active: true },
  { id: '7', category_id: 'machine-learning', name: 'Linear Regression', display_order: 2, is_active: true },
  { id: '8', category_id: 'machine-learning', name: 'Logistic Regression', display_order: 3, is_active: true },
  { id: '9', category_id: 'machine-learning', name: 'Decision Trees', display_order: 4, is_active: true },
  { id: '10', category_id: 'machine-learning', name: 'Random Forest', display_order: 5, is_active: true },
  { id: '11', category_id: 'machine-learning', name: 'XGBoost', display_order: 6, is_active: true },
  { id: '12', category_id: 'machine-learning', name: 'SVM', display_order: 7, is_active: true },
  { id: '13', category_id: 'machine-learning', name: 'KNN', display_order: 8, is_active: true },
  { id: '14', category_id: 'machine-learning', name: 'Feature Engineering', display_order: 9, is_active: true },
  { id: '15', category_id: 'machine-learning', name: 'Model Evaluation', display_order: 10, is_active: true },
  // Deep Learning & CV
  { id: '16', category_id: 'deep-learning-cv', name: 'PyTorch', display_order: 1, is_active: true },
  { id: '17', category_id: 'deep-learning-cv', name: 'TensorFlow', display_order: 2, is_active: true },
  { id: '18', category_id: 'deep-learning-cv', name: 'Keras', display_order: 3, is_active: true },
  { id: '19', category_id: 'deep-learning-cv', name: 'CNN', display_order: 4, is_active: true },
  { id: '20', category_id: 'deep-learning-cv', name: 'Transfer Learning', display_order: 5, is_active: true },
  { id: '21', category_id: 'deep-learning-cv', name: 'ResNet50', display_order: 6, is_active: true },
  { id: '22', category_id: 'deep-learning-cv', name: 'EfficientNet', display_order: 7, is_active: true },
  { id: '23', category_id: 'deep-learning-cv', name: 'MobileNetV3', display_order: 8, is_active: true },
  { id: '24', category_id: 'deep-learning-cv', name: 'YOLOv8', display_order: 9, is_active: true },
  { id: '25', category_id: 'deep-learning-cv', name: 'OpenCV', display_order: 10, is_active: true },
  // GenAI & LLM
  { id: '26', category_id: 'genai-llm', name: 'Large Language Models', display_order: 1, is_active: true },
  { id: '27', category_id: 'genai-llm', name: 'Retrieval-Augmented Generation (RAG)', display_order: 2, is_active: true },
  { id: '28', category_id: 'genai-llm', name: 'LangChain', display_order: 3, is_active: true },
  { id: '29', category_id: 'genai-llm', name: 'Hugging Face', display_order: 4, is_active: true },
  { id: '30', category_id: 'genai-llm', name: 'Sentence Transformers', display_order: 5, is_active: true },
  { id: '31', category_id: 'genai-llm', name: 'Embeddings', display_order: 6, is_active: true },
  { id: '32', category_id: 'genai-llm', name: 'Vector Databases', display_order: 7, is_active: true },
  { id: '33', category_id: 'genai-llm', name: 'Prompt Engineering', display_order: 8, is_active: true },
  { id: '34', category_id: 'genai-llm', name: 'Groq API', display_order: 9, is_active: true },
  // Analytics
  { id: '35', category_id: 'data-analytics', name: 'Power BI', display_order: 1, is_active: true },
  { id: '36', category_id: 'data-analytics', name: 'Power Query', display_order: 2, is_active: true },
  { id: '37', category_id: 'data-analytics', name: 'DAX', display_order: 3, is_active: true },
  { id: '38', category_id: 'data-analytics', name: 'Matplotlib', display_order: 4, is_active: true },
  { id: '39', category_id: 'data-analytics', name: 'Seaborn', display_order: 5, is_active: true },
  { id: '40', category_id: 'data-analytics', name: 'Plotly', display_order: 6, is_active: true },
  { id: '41', category_id: 'data-analytics', name: 'Exploratory Data Analysis', display_order: 7, is_active: true },
  // Dev & DBs
  { id: '42', category_id: 'dev-databases', name: 'FastAPI', display_order: 1, is_active: true },
  { id: '43', category_id: 'dev-databases', name: 'Flask', display_order: 2, is_active: true },
  { id: '44', category_id: 'dev-databases', name: 'Streamlit', display_order: 3, is_active: true },
  { id: '45', category_id: 'dev-databases', name: 'MySQL', display_order: 4, is_active: true },
  { id: '46', category_id: 'dev-databases', name: 'PostgreSQL', display_order: 5, is_active: true },
  { id: '47', category_id: 'dev-databases', name: 'MongoDB', display_order: 6, is_active: true },
  { id: '48', category_id: 'dev-databases', name: 'Git', display_order: 7, is_active: true },
  { id: '49', category_id: 'dev-databases', name: 'GitHub', display_order: 8, is_active: true },
  { id: '50', category_id: 'dev-databases', name: 'Docker', display_order: 9, is_active: true }
];

const INITIAL_EDUCATION: EducationRecord[] = [
  {
    id: 'master-ens',
    degree_en: "Master's Degree in Data Science – Second Year",
    degree_fr: 'Master en Data Science – Deuxième Année',
    degree_ar: 'ماستر في علوم البيانات – السنة الثانية',
    institution_en: 'École Normale Supérieure (ENS), Tétouan, Morocco',
    institution_fr: 'École Normale Supérieure (ENS), Tétouan, Maroc',
    institution_ar: 'المدرسة العليا للأساتذة (ENS)، تطوان، المغرب',
    period_en: '2025 – Present',
    period_fr: '2025 – Présent',
    period_ar: '2025 – حتى الآن',
    location_en: 'Tétouan, Morocco',
    location_fr: 'Tétouan, Maroc',
    location_ar: 'تطوان، المغرب',
    description_en: 'Advanced studies in Data Science, Statistics, Machine Learning, Deep Learning, Optimization, and Artificial Intelligence.',
    description_fr: 'Études approfondies en Data Science, Statistique, Machine Learning, Deep Learning, Optimisation et Intelligence Artificielle.',
    description_ar: 'دراسات معمقة ومتقدمة في علوم البيانات، الإحصاء، تعلم الآلة، التعلم العميق، التحسين الرياضي، والذكاء الاصطناعي.',
    pillars_en: [
      'Statistical Learning & Advanced Probability',
      'Deep Learning Architectures & Computer Vision',
      'Mathematical Optimization & Predictive Modeling',
      'Big Data Systems, Cloud & AI Engineering'
    ],
    pillars_fr: [
      'Apprentissage Statistique & Probabilités Avancées',
      'Architectures de Deep Learning & Vision par Ordinateur',
      'Optimisation Mathématique & Modélisation Prédictive',
      'Systèmes Big Data, Cloud & Ingénierie IA'
    ],
    pillars_ar: [
      'التعلم الإحصائي والاحتمالات المتقدمة',
      'بنى التعلم العميق والرؤية الحاسوبية',
      'التحسين الرياضي والنمذجة التنبؤية',
      'أنظمة البيانات الضخمة، السحابة وهندسة الذكاء الاصطناعي'
    ],
    display_order: 1,
    is_published: true,
  }
];

const INITIAL_SOCIAL: SocialLinkRecord[] = [
  { id: 'github', platform: 'github', label: 'GitHub', url: 'https://github.com/placeholder-abderrahman', icon: 'GithubIcon', is_active: true, display_order: 1 },
  { id: 'linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/placeholder-abderrahman', icon: 'LinkedinIcon', is_active: true, display_order: 2 },
  { id: 'email', platform: 'email', label: 'Direct Email', url: 'mailto:contact.abderrahman.placeholder@example.com', icon: 'Mail', is_active: true, display_order: 3 },
];

const INITIAL_SETTINGS: SiteSettingsRecord = {
  cv_url: '/Abderrahman_El_Harakani_CV.pdf',
  filename: 'Abderrahman_El_Harakani_CV.pdf',
  last_updated: '2026-11-20',
  contact_recipient_email: 'contact.abderrahman.placeholder@example.com'
};

// -------------------------------------------------------------
// CONTEXT TYPE
// -------------------------------------------------------------
interface DataContextType {
  profile: ProfileRecord;
  projects: ProjectRecord[];
  skillCategories: SkillCategoryRecord[];
  skills: SkillRecord[];
  education: EducationRecord[];
  socialLinks: SocialLinkRecord[];
  settings: SiteSettingsRecord;
  messages: ContactMessageRecord[];
  isLoading: boolean;
  isSupabaseLive: boolean;
  refreshData: () => Promise<void>;

  // CRUD handlers
  updateProfile: (profile: Partial<ProfileRecord>) => Promise<boolean>;
  saveProject: (project: ProjectRecord) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleProjectPublish: (id: string) => Promise<boolean>;
  toggleProjectFeatured: (id: string) => Promise<boolean>;

  saveSkillCategory: (cat: SkillCategoryRecord) => Promise<boolean>;
  deleteSkillCategory: (id: string) => Promise<boolean>;
  saveSkill: (skill: SkillRecord) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;

  saveEducation: (edu: EducationRecord) => Promise<boolean>;
  deleteEducation: (id: string) => Promise<boolean>;

  saveSocialLink: (link: SocialLinkRecord) => Promise<boolean>;
  deleteSocialLink: (id: string) => Promise<boolean>;

  updateSettings: (settings: Partial<SiteSettingsRecord>) => Promise<boolean>;

  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => Promise<boolean>;
  markMessageRead: (id: string) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;

  // CV Analytics
  cvDownloads: CVDownloadEvent[];
  trackCVDownload: (version?: string) => Promise<void>;
  refreshCVDownloads: () => Promise<void>;

  // Website Visitor Analytics
  pageViews: PageViewEvent[];
  trackPageView: (pagePath?: string) => Promise<void>;
  refreshPageViews: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'ae_portfolio_data_';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();

  const [profile, setProfile] = useState<ProfileRecord>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}profile`);
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [skillCategories, setSkillCategories] = useState<SkillCategoryRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [skills, setSkills] = useState<SkillRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}skills`);
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [education, setEducation] = useState<EducationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}education`);
    return saved ? JSON.parse(saved) : INITIAL_EDUCATION;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinkRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}social`);
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL;
  });

  const [settings, setSettings] = useState<SiteSettingsRecord>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [messages, setMessages] = useState<ContactMessageRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}messages`);
    return saved ? JSON.parse(saved) : [];
  });

  const [cvDownloads, setCvDownloads] = useState<CVDownloadEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}cv_downloads`);
    return saved ? JSON.parse(saved) : [];
  });

  const [pageViews, setPageViews] = useState<PageViewEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}page_views`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  // Sync to localStorage as backup/offline layer
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}categories`, JSON.stringify(skillCategories));
  }, [skillCategories]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}skills`, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}education`, JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}social`, JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}cv_downloads`, JSON.stringify(cvDownloads));
  }, [cvDownloads]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}page_views`, JSON.stringify(pageViews));
  }, [pageViews]);

  // Dedicated CV Analytics Fetch
  const refreshCVDownloads = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('cv_download_events')
        .select('*')
        .order('downloaded_at', { ascending: false });
      if (!error && data) {
        setCvDownloads(data as CVDownloadEvent[]);
      }
    } catch (err) {
      console.warn('Could not fetch CV download analytics:', err);
    }
  };

  // Dedicated Website Visitor Analytics Fetch
  const refreshPageViews = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('page_view_events')
        .select('*')
        .order('visited_at', { ascending: false });
      if (!error && data) {
        setPageViews(data as PageViewEvent[]);
      }
    } catch (err) {
      console.warn('Could not fetch page view analytics:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshCVDownloads();
      refreshPageViews();
    }
  }, [isAdmin]);

  // Fetch live from Supabase if configured
  const refreshData = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsLoading(false);
      setIsSupabaseLive(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch Profile
      const { data: profData } = await supabase.from('profiles').select('*').limit(1).single();
      if (profData) {
        setProfile(profData as ProfileRecord);
      }

      // Fetch Projects
      const { data: projData } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (projData && projData.length > 0) {
        setProjects(projData as ProjectRecord[]);
      }

      // Fetch Categories
      const { data: catData } = await supabase.from('skill_categories').select('*').order('display_order', { ascending: true });
      if (catData && catData.length > 0) {
        setSkillCategories(catData as SkillCategoryRecord[]);
      }

      // Fetch Skills
      const { data: skillData } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
      if (skillData && skillData.length > 0) {
        setSkills(skillData as SkillRecord[]);
      }

      // Fetch Education
      const { data: eduData } = await supabase.from('education').select('*').order('display_order', { ascending: true });
      if (eduData && eduData.length > 0) {
        setEducation(eduData as EducationRecord[]);
      }

      // Fetch Social Links
      const { data: socialData } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });
      if (socialData && socialData.length > 0) {
        setSocialLinks(socialData as SocialLinkRecord[]);
      }

      // Fetch Settings
      const { data: setData } = await supabase.from('site_settings').select('*');
      if (setData && setData.length > 0) {
        const cvRow = setData.find((s: any) => s.key === 'cv_config');
        if (cvRow?.value) {
          setSettings(prev => ({ ...prev, ...cvRow.value }));
        }
      }

      // Fetch Messages (if authenticated)
      const { data: msgData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (msgData) {
        setMessages(msgData as ContactMessageRecord[]);
      }

      // Fetch CV Downloads (if admin)
      if (isAdmin) {
        const { data: cvData } = await supabase.from('cv_download_events').select('*').order('downloaded_at', { ascending: false });
        if (cvData) {
          setCvDownloads(cvData as CVDownloadEvent[]);
        }

        const { data: pvData } = await supabase.from('page_view_events').select('*').order('visited_at', { ascending: false });
        if (pvData) {
          setPageViews(pvData as PageViewEvent[]);
        }
      }

      setIsSupabaseLive(true);
    } catch (err) {
      console.warn('Supabase fetch failed, continuing with local data:', err);
      setIsSupabaseLive(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // -------------------------------------------------------------
  // CRUD OPERATIONS
  // -------------------------------------------------------------
  const updateProfile = async (newProfile: Partial<ProfileRecord>): Promise<boolean> => {
    const updated = { ...profile, ...newProfile, updated_at: new Date().toISOString() };
    setProfile(updated);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').upsert(updated);
      } catch (err) {
        console.error('Supabase profile update failed:', err);
      }
    }
    return true;
  };

  const saveProject = async (project: ProjectRecord): Promise<boolean> => {
    const exists = projects.some(p => p.id === project.id);
    const updatedList = exists
      ? projects.map(p => (p.id === project.id ? { ...project, updated_at: new Date().toISOString() } : p))
      : [...projects, { ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];

    setProjects(updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('projects').upsert(project);
      } catch (err) {
        console.error('Supabase project upsert failed:', err);
      }
    }
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    setProjects(prev => prev.filter(p => p.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase project delete failed:', err);
      }
    }
    return true;
  };

  const toggleProjectPublish = async (id: string): Promise<boolean> => {
    const project = projects.find(p => p.id === id);
    if (!project) return false;
    return saveProject({ ...project, is_published: !project.is_published });
  };

  const toggleProjectFeatured = async (id: string): Promise<boolean> => {
    const project = projects.find(p => p.id === id);
    if (!project) return false;
    return saveProject({ ...project, is_featured: !project.is_featured });
  };

  const saveSkillCategory = async (cat: SkillCategoryRecord): Promise<boolean> => {
    const exists = skillCategories.some(c => c.id === cat.id);
    const updatedList = exists
      ? skillCategories.map(c => (c.id === cat.id ? cat : c))
      : [...skillCategories, cat];

    setSkillCategories(updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('skill_categories').upsert(cat);
      } catch (err) {
        console.error('Supabase category upsert failed:', err);
      }
    }
    return true;
  };

  const deleteSkillCategory = async (id: string): Promise<boolean> => {
    setSkillCategories(prev => prev.filter(c => c.id !== id));
    setSkills(prev => prev.filter(s => s.category_id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('skill_categories').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase category delete failed:', err);
      }
    }
    return true;
  };

  const saveSkill = async (skill: SkillRecord): Promise<boolean> => {
    const exists = skills.some(s => s.id === skill.id);
    const updatedList = exists
      ? skills.map(s => (s.id === skill.id ? skill : s))
      : [...skills, skill];

    setSkills(updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('skills').upsert(skill);
      } catch (err) {
        console.error('Supabase skill upsert failed:', err);
      }
    }
    return true;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    setSkills(prev => prev.filter(s => s.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase skill delete failed:', err);
      }
    }
    return true;
  };

  const saveEducation = async (edu: EducationRecord): Promise<boolean> => {
    const exists = education.some(e => e.id === edu.id);
    const updatedList = exists
      ? education.map(e => (e.id === edu.id ? edu : e))
      : [...education, edu];

    setEducation(updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('education').upsert(edu);
      } catch (err) {
        console.error('Supabase education upsert failed:', err);
      }
    }
    return true;
  };

  const deleteEducation = async (id: string): Promise<boolean> => {
    setEducation(prev => prev.filter(e => e.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('education').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase education delete failed:', err);
      }
    }
    return true;
  };

  const saveSocialLink = async (link: SocialLinkRecord): Promise<boolean> => {
    const exists = socialLinks.some(s => s.id === link.id);
    const updatedList = exists
      ? socialLinks.map(s => (s.id === link.id ? link : s))
      : [...socialLinks, link];

    setSocialLinks(updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('social_links').upsert(link);
      } catch (err) {
        console.error('Supabase social upsert failed:', err);
      }
    }
    return true;
  };

  const deleteSocialLink = async (id: string): Promise<boolean> => {
    setSocialLinks(prev => prev.filter(s => s.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('social_links').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase social delete failed:', err);
      }
    }
    return true;
  };

  const updateSettings = async (newSettings: Partial<SiteSettingsRecord>): Promise<boolean> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'cv_config',
          value: updated
        });
      } catch (err) {
        console.error('Supabase settings update failed:', err);
      }
    }
    return true;
  };

  const submitContactMessage = async (msg: { name: string; email: string; subject: string; message: string }): Promise<boolean> => {
    const newMsg: ContactMessageRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [newMsg, ...prev]);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contact_messages').insert([newMsg]);
      } catch (err) {
        console.error('Supabase contact message insert failed:', err);
      }
    }
    return true;
  };

  const markMessageRead = async (id: string): Promise<boolean> => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, is_read: true } : m)));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
      } catch (err) {
        console.error('Supabase mark read failed:', err);
      }
    }
    return true;
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    setMessages(prev => prev.filter(m => m.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete message failed:', err);
      }
    }
    return true;
  };

  const trackCVDownload = async (version?: string): Promise<void> => {
    // Avoid counting admin preview clicks as public downloads (Requirement 8)
    if (isAdmin) {
      return;
    }

    const cvVersion = version || settings.filename || 'Abderrahman_El_Harakani_CV.pdf';

    try {
      const supabase = getSupabase();
      if (supabase) {
        // Record event in Supabase table cv_download_events (Requirements 1, 2, 3)
        const { error } = await supabase.from('cv_download_events').insert([
          {
            cv_version: cvVersion,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 255) : null,
            referrer: typeof document !== 'undefined' ? (document.referrer || window.location.href).slice(0, 255) : null,
          }
        ]);
        if (error) {
          console.warn('Supabase cv_download_events tracking warning:', error.message);
        }
      } else {
        // Fallback for local demo/offline mode
        const newEvent: CVDownloadEvent = {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          cv_version: cvVersion,
          downloaded_at: new Date().toISOString(),
        };
        setCvDownloads(prev => [newEvent, ...prev]);
      }
    } catch (err) {
      // Requirement 9: Handle database errors without preventing the visitor from downloading the CV
      console.warn('Failed to record CV download event:', err);
    }
  };

  const trackPageView = async (pagePath?: string): Promise<void> => {
    // 1. Exclude authenticated administrators to avoid polluting public stats
    if (isAdmin) {
      return;
    }

    const currentPath = pagePath || (typeof window !== 'undefined' ? (window.location.pathname + (window.location.hash || '') || '/') : '/');

    // 2. Do not track admin dashboard routes
    if (currentPath.startsWith('/admin')) {
      return;
    }

    const visitorId = getOrCreateVisitorId();
    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer.slice(0, 255) : null;
    const userAgent = typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent.slice(0, 255) : null;

    try {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.from('page_view_events').insert([
          {
            visitor_id: visitorId,
            page_path: currentPath,
            referrer: referrer,
            user_agent: userAgent,
          }
        ]);
        if (error) {
          console.warn('Supabase page_view_events insert notice:', error.message);
        }
      } else {
        // Fallback for local demo/offline mode
        const localViews: PageViewEvent[] = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_PREFIX}page_views`) || '[]');
        const newEvent: PageViewEvent = {
          id: `local-pv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          visitor_id: visitorId,
          page_path: currentPath,
          referrer: referrer,
          user_agent: userAgent,
          visited_at: new Date().toISOString(),
        };
        const updated = [newEvent, ...localViews].slice(0, 200);
        setPageViews(updated);
      }
    } catch (err) {
      // Fail-open: Never disrupt website navigation
      console.warn('Failed to record page view event:', err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        projects,
        skillCategories,
        skills,
        education,
        socialLinks,
        settings,
        messages,
        isLoading,
        isSupabaseLive,
        refreshData,
        updateProfile,
        saveProject,
        deleteProject,
        toggleProjectPublish,
        toggleProjectFeatured,
        saveSkillCategory,
        deleteSkillCategory,
        saveSkill,
        deleteSkill,
        saveEducation,
        deleteEducation,
        saveSocialLink,
        deleteSocialLink,
        updateSettings,
        submitContactMessage,
        markMessageRead,
        deleteMessage,
        cvDownloads,
        trackCVDownload,
        refreshCVDownloads,
        pageViews,
        trackPageView,
        refreshPageViews,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
