export const fr = {
  nav: {
    home: "Accueil",
    about: "À Propos",
    skills: "Compétences",
    projects: "Projets",
    education: "Formation",
    contact: "Contact",
    downloadCV: "Télécharger CV",
    themeToggleLight: "Activer le Mode Clair",
    themeToggleDark: "Activer le Mode Sombre",
    language: "Langue",
    menuOpen: "Ouvrir le menu de navigation",
    menuClose: "Fermer le menu de navigation",
  },
  hero: {
    badge: "OUVERT AUX OPPORTUNITÉS PFE – 2027",
    greeting: "Bonjour, je suis",
    name: "Abderrahman El Harakani.",
    role: "Data Scientist & Ingénieur IA",
    roleTagline: "Développant des Solutions Intelligentes.",
    description: "Étudiant en 2ème année de Master Data Science, passionné par l'Intelligence Artificielle, le Machine Learning et la Data Analytics. Je transforme les données complexes en insights exploitables et conçois des applications intelligentes pour résoudre des problèmes concrets.",
    exploreProjects: "Explorer Mes Projets",
    downloadCV: "Télécharger Mon CV",
    getInTouch: "Me Contacter",
    githubTitle: "Voir le Profil GitHub",
    linkedinTitle: "Voir le Profil LinkedIn",
    emailTitle: "Envoyer un E-mail",
    illustrationAlt: "Visualisation Interactive d'Architecture Neurale et Data Science",
    photoPlaceholderHint: "Emplacement photo : Remplacez par votre photographie professionnelle ou conservez ce visuel IA interactif.",
  },
  about: {
    title: "À Propos de Moi",
    subtitle: "Passionné par la Data, l'Intelligence et l'Innovation.",
    bio1: "Je poursuis actuellement la deuxième année d'un Master en Data Science à l'École Normale Supérieure (ENS) de Tétouan, au Maroc.",
    bio2: "Mes centres d'intérêt se situent à l'intersection de la Data Science et de l'Intelligence Artificielle. Je travaille sur la modélisation prédictive, le Deep Learning, la Computer Vision, l'IA Générative et la Data Analytics.",
    bio3: "J'aime développer des solutions de bout en bout, de la collecte et du prétraitement des données jusqu'au développement, à l'évaluation, au déploiement et à la création d'applications interactives.",
    bio4: "J'approfondis continuellement mes compétences et explore les technologies émergentes pour transformer le savoir théorique en réalisations concrètes.",
    highlight1Title: "DATA SCIENCE",
    highlight1Desc: "Analyse statistique, modélisation prédictive, feature engineering et extraction d'insights à partir de jeux de données complexes.",
    highlight2Title: "INTELLIGENCE ARTIFICIELLE",
    highlight2Desc: "Machine Learning, Deep Learning, Computer Vision et applications d'IA Générative.",
    highlight3Title: "INGÉNIERIE IA",
    highlight3Desc: "Conception d'applications intelligentes, intégration de LLMs, développement d'APIs et déploiement de modèles.",
  },
  skills: {
    title: "Expertise Technique",
    subtitle: "Technologies et outils que j'utilise pour transformer les idées en solutions.",
    cat1Title: "Programmation & Traitement des Données",
    cat1Desc: "Langages clés et bibliothèques de calcul quantitatif pour la manipulation de données et le calcul statistique.",
    cat2Title: "Machine Learning",
    cat2Desc: "Algorithmes supervisés et non supervisés, ingénierie des variables et pipelines d'évaluation rigoureux.",
    cat3Title: "Deep Learning & Computer Vision",
    cat3Desc: "Architectures neuronales, transfer learning, extraction de caractéristiques visuelles et vision par ordinateur.",
    cat4Title: "IA Générative & Ingénierie LLM",
    cat4Desc: "Architectures RAG, embeddings vectoriels, orchestration d'agents et inférence accélérée de LLMs.",
    cat5Title: "Data Analytics & Visualisation",
    cat5Desc: "Analyse exploratoire des données, tableaux de bord décisionnels interactifs et narration visuelle des métriques.",
    cat6Title: "Développement & Bases de Données",
    cat6Desc: "Frameworks d'API modernes, bases relationnelles et NoSQL, conteneurisation et contrôle de versions.",
  },
  projects: {
    title: "Projets Phares",
    subtitle: "Transformer les idées en solutions intelligentes concrètes.",
    filterAll: "Tous les Projets",
    filterAI: "Intelligence Artificielle",
    filterML: "Machine Learning",
    filterDL: "Deep Learning",
    filterAnalytics: "Data Analytics",
    problemLabel: "Problématique Résolue",
    approachLabel: "Approche Technique",
    keyFeaturesLabel: "Fonctionnalités Clés",
    techLabel: "Stack Technique",
    viewDetails: "Voir les Détails",
    githubRepo: "Dépôt GitHub",
    liveDemo: "Démo en Ligne",
    closeModal: "Fermer les Détails",
    comingSoon: "Lien actif dès publication du dépôt",

    // Project 1: TERRALIS
    terralis: {
      title: "Classification d'Images Satellitaires – TERRALIS",
      category: "Deep Learning / Computer Vision",
      description: "Un projet de classification d'images satellitaires basé sur l'imagerie Sentinel-2 et le jeu de données EuroSAT, comprenant environ 27 000 images réparties sur 10 classes d'occupation et d'utilisation des sols.",
      problem: "Automatiser l'identification et la classification de l'occupation des sols à partir d'images satellitaires haute résolution sur divers paysages européens.",
      approach: "Application de techniques de Transfer Learning avec benchmark comparatif entre ResNet50, EfficientNet-B0 et MobileNetV3, prétraitement avancé et intégration dans une application Streamlit.",
      features: [
        "Mise en œuvre du Transfer Learning",
        "Comparaison empirique de ResNet50, EfficientNet-B0 et MobileNetV3",
        "Pipeline robuste de prétraitement d'images multispectrales",
        "Évaluation complète des modèles et matrice de confusion détaillée",
        "Interface web interactive d'inférence développée avec Streamlit"
      ]
    },

    // Project 2: DocuMind AI
    documind: {
      title: "DocuMind AI – Assistant PDF Intelligent",
      category: "Intelligence Artificielle / IA Générative",
      description: "Une application intelligente de questions-réponses sur documents PDF reposant sur le Retrieval-Augmented Generation (RAG).",
      problem: "Dépasser les limites de la lecture statique des documents PDF complexes en permettant des requêtes contextuelles sans hallucinations.",
      approach: "Architecture RAG complète utilisant LangChain, découpage sémantique (chunking), vectorisation avec Sentence Transformers, stockage vectoriel et inférence ultra-rapide avec Groq API.",
      features: [
        "Extraction automatisée de PDF et segmentation textuelle sémantique",
        "Génération d'embeddings denses avec Sentence Transformers",
        "Recherche par similarité vectorielle et reclassement des passages",
        "Réponses contextuelles précises et étayées par des citations de sources",
        "Intégration de l'API Groq pour un temps de réponse inférieur à la seconde"
      ]
    },

    // Project 3: Machine Learning Studio
    mlstudio: {
      title: "Machine Learning Studio – Plateforme ML Interactive",
      category: "Machine Learning",
      description: "Une application interactive conçue pour simplifier et accélérer les flux de travail en Machine Learning.",
      problem: "La création manuelle de scripts pour l'exploration et les tests de modèles ralentit l'expérimentation rapide.",
      approach: "Développement d'une plateforme Streamlit complète intégrant EDA automatique, matrices de corrélation dynamiques, prétraitement en un clic et entraînement comparatif de multiples algorithmes.",
      features: [
        "Importation fluide de jeux de données CSV et détection de schéma",
        "Analyse exploratoire automatisée avec visualisations Plotly",
        "Matrices de corrélation et graphiques de distribution interactifs",
        "Prétraitement automatique (encodage et gestion des valeurs manquantes)",
        "Entraînement simultané de plusieurs modèles avec comparaison des métriques"
      ]
    },

    // Project 4: Sales & Operations Dashboard
    sales: {
      title: "Tableau de Bord Ventes & Opérations",
      category: "Data Analytics",
      description: "Un tableau de bord interactif Power BI conçu pour analyser la performance commerciale et les indicateurs opérationnels.",
      problem: "La dispersion des données d'entreprise entravait le suivi en temps réel de la croissance des ventes, de la logistique et de la rentabilité.",
      approach: "Modélisation de données en schéma en étoile sous Power Query, élaboration de mesures DAX avancées (croissance N/N-1, marges) et création de visuels exécutifs ergonomiques.",
      features: [
        "KPIs fondamentaux de chiffre d'affaires, marge brute et volumes",
        "Analyse détaillée des performances par catégorie de produits",
        "Cartographie géographique interactive et taux de pénétration",
        "Suivi opérationnel et détection des goulots d'étranglement logistiques",
        "Filtrage croisé interactif et exploration hiérarchique détaillée"
      ]
    },

    // Project 5: Healthcare Emergency Analytics
    healthcare: {
      title: "Tableau de Bord Analytique des Urgences Hospitalières",
      category: "Data Analytics",
      description: "Un tableau de bord analytique appliqué au secteur de la santé, focalisé sur la performance des services d'urgences.",
      problem: "La saturation des services d'urgence et la variabilité des flux de patients compliquent la planification des effectifs et allongent les délais d'attente.",
      approach: "Traitement des flux d'admissions et de triage dans Power BI pour identifier les facteurs d'attente et optimiser la rotation des lits.",
      features: [
        "Analyse des admissions aux urgences et classification de gravité du triage",
        "Surveillance des temps d'attente des patients par rapport aux seuils cliniques",
        "Indicateurs de performance opérationnelle et de rotation des lits",
        "Détection des heures de pointe et analyse de la charge de travail par équipe",
        "Vues analytiques détaillées par typologie de patients et spécialités"
      ]
    }
  },
  education: {
    title: "Formation Académique",
    subtitle: "Solides bases théoriques et rigueur mathématique appliquée.",
    degree: "Master en Data Science – Deuxième Année",
    institution: "École Normale Supérieure (ENS), Tétouan, Maroc",
    period: "2025 – Présent",
    description: "Études approfondies en Data Science, Statistique, Machine Learning, Deep Learning, Optimisation et Intelligence Artificielle.",
    academicPillarsTitle: "Piliers Académiques Majeurs",
    pillars: [
      "Apprentissage Statistique & Probabilités Avancées",
      "Architectures de Deep Learning & Vision par Ordinateur",
      "Optimisation Mathématique & Modélisation Prédictive",
      "Systèmes Big Data, Cloud & Ingénierie IA"
    ]
  },
  focus: {
    title: "Mes Domaines d'Exploration",
    subtitle: "Apprentissage continu et nouvelles frontières technologiques.",
    card1Title: "IA Générative & Ingénierie LLM",
    card1Desc: "Exploration des architectures RAG, des embeddings, des bases de données vectorielles et des assistants IA intelligents.",
    card1Topics: ["Pipelines RAG", "Bases Vectorielles", "Prompt Engineering", "Agents Autonomes"],
    card2Title: "MLOps & Déploiement de l'IA",
    card2Desc: "Apprentissage de la création de systèmes de Machine Learning reproductibles, évolutifs et prêts pour la production.",
    card2Topics: ["Conteneurisation Docker", "Points d'accès FastAPI", "Monitoring de Modèles", "CI/CD pour le ML"],
    card3Title: "Data Science Avancée",
    card3Desc: "Approfondissement des connaissances en apprentissage statistique, optimisation, modélisation prédictive et analyse avancée.",
    card3Topics: ["Inférence Statistique", "Optimisation Convexe", "Séries Temporelles", "Méthodes Ensemblistes"],
  },
  contact: {
    title: "Construisons Quelque Chose d'Intelligent Ensemble.",
    subtitle: "Je suis toujours ouvert à l'échange autour de la Data Science, de l'Intelligence Artificielle, de projets innovants et d'opportunités professionnelles.",
    availabilityNotice: "Disponible pour un stage de fin d'études (PFE) de 4 à 6 mois en 2027 (Maroc ou International).",
    formName: "Nom Complet",
    formNamePlaceholder: "ex. Jean Dupont",
    formEmail: "Adresse E-mail",
    formEmailPlaceholder: "ex. jean.dupont@example.com",
    formSubject: "Sujet",
    formSubjectPlaceholder: "ex. Opportunité PFE / Collaboration IA",
    formMessage: "Message",
    formMessagePlaceholder: "Décrivez votre projet, votre équipe ou votre opportunité...",
    submitBtn: "Envoyer le Message",
    submittingBtn: "Envoi en cours...",
    successTitle: "Message Envoyé avec Succès !",
    successDesc: "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
    errorTitle: "Formulaire Incomplet",
    errorDesc: "Veuillez vérifier que tous les champs requis sont remplis avec un e-mail valide.",
    directEmailLabel: "E-mail Direct",
    linkedinLabel: "Profil LinkedIn",
    githubLabel: "Profil GitHub",
    locationLabel: "Localisation",
    locationValue: "Maroc",
    statusBadge: "Candidat Actif",
  },
  cvModal: {
    title: "Curriculum Vitae – Abderrahman El Harakani",
    subtitle: "Data Scientist | Ingénieur IA",
    previewNotice: "Le document CV officiel est configuré. Vous pouvez télécharger la version actuelle ci-dessous.",
    downloadBtn: "Télécharger le CV PDF",
    closeBtn: "Fermer",
    replaceHint: "Pour actualiser avec votre version définitive, déposez simplement votre fichier dans public/Abderrahman_El_Harakani_CV.pdf.",
  },
  footer: {
    role: "Data Scientist & Ingénieur IA",
    description: "Transformer les données complexes en intelligence prédictive et concevoir des systèmes d'IA robustes.",
    quickLinks: "Liens Rapides",
    connect: "Réseaux",
    rights: "Tous droits réservés.",
    builtWith: "Conçu & développé avec React, TypeScript & Tailwind CSS",
  }
};
