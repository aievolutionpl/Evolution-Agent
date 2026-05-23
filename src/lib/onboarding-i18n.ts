// Static onboarding dictionary for the AI Evolution Labs welcome panel.
// 5 languages — Polish, English, Spanish, German, French.

export type OnboardingLang = 'pl' | 'en' | 'es' | 'de' | 'fr'

export type OnboardingStep = {
  title: string
  body: string
  highlights: Array<string>
}

export type OnboardingStrings = {
  brandLabel: string
  tagline: string
  welcome: {
    title: string
    subtitle: string
    ctaStart: string
    ctaSkip: string
    ctaNext: string
    ctaPrev: string
    ctaFinish: string
    stepLabel: (current: number, total: number) => string
  }
  steps: Array<OnboardingStep>
  ctaSampleTask: {
    label: string
    prompt: string
  }
  langPickerLabel: string
}

export const ONBOARDING_LANGS: Array<{
  id: OnboardingLang
  label: string
  flag: string
}> = [
  { id: 'pl', label: 'Polski', flag: '🇵🇱' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
]

export const ONBOARDING_STRINGS: Record<OnboardingLang, OnboardingStrings> = {
  pl: {
    brandLabel: 'AI Evolution Labs · Hermes',
    tagline: 'Twój biznes. Zautomatyzowany.',
    welcome: {
      title: 'Witaj w Hermesie',
      subtitle:
        'To nie kolejny chatbot. To agent AI, który realnie wykonuje pracę dla Twojego biznesu — briefy, raporty, automatyzacje, research.',
      ctaStart: 'Rozpocznij',
      ctaSkip: 'Pomiń',
      ctaNext: 'Dalej',
      ctaPrev: 'Wstecz',
      ctaFinish: 'Uruchom pierwsze zadanie',
      stepLabel: (c, t) => `Krok ${c} z ${t}`,
    },
    steps: [
      {
        title: 'Czym jest Hermes?',
        body:
          'Hermes to flagowy agent AI Evolution Labs. Rozumie kontekst Twojej firmy, korzysta z narzędzi, pamięta poprzednie rozmowy i sam podejmuje kroki, żeby dowieźć wynik.',
        highlights: [
          'Działa autonomicznie — nie tylko odpowiada, ale wykonuje',
          'Pamięta — Twoje preferencje, klienci, projekty',
          'Łączy się z narzędziami — Notion, Gmail, Slack, GitHub i innymi',
        ],
      },
      {
        title: 'Co potrafi dla Twojego biznesu',
        body:
          'Cztery główne ścieżki wbudowane na ekranie startowym — jeden klik i zaczynasz.',
        highlights: [
          'Brief klienta / propozycja — pełna oferta z 3 pytań',
          'Raport / analiza biznesowa — KPI, podsumowanie tygodnia',
          'Automatyzacja workflow — wieloetapowe przepisy z cron i MCP',
          'Market intelligence — skan konkurencji, due diligence',
        ],
      },
      {
        title: 'Jak tego używać',
        body:
          'Wszystko jest pod ręką w bocznym menu. Pisz naturalnie — Hermes sam wybiera narzędzia.',
        highlights: [
          'Chat — codzienna rozmowa z agentem',
          'Conductor — rozłóż cel na misję i deleguj podzadania',
          'Swarm — wielu agentów równolegle dla większych projektów',
          'Skills + MCP — biblioteka umiejętności i integracji',
        ],
      },
      {
        title: 'Gotów, by zacząć?',
        body:
          'Uruchom przykładowe zadanie — Hermes poprosi o 3 dane wejściowe i wygeneruje gotowy do wysłania brief klienta.',
        highlights: [],
      },
    ],
    ctaSampleTask: {
      label: 'Zacznij od przykładowego briefu klienta',
      prompt:
        'Cześć Hermes. Zacznijmy od pełnego briefu klienta. Zadaj mi 3 krótkie pytania (branża, cel, budżet), a potem wygeneruj 1-stronicową propozycję: problem, podejście (3 fazy), deliverable, timeline, widełki cenowe. Po polsku, tonem executive.',
    },
    langPickerLabel: 'Język',
  },
  en: {
    brandLabel: 'AI Evolution Labs · Hermes',
    tagline: 'Your business. Automated.',
    welcome: {
      title: 'Welcome to Hermes',
      subtitle:
        'Not another chatbot. An AI agent that actually does work for your business — briefs, reports, automations, research.',
      ctaStart: 'Start',
      ctaSkip: 'Skip',
      ctaNext: 'Next',
      ctaPrev: 'Back',
      ctaFinish: 'Run my first task',
      stepLabel: (c, t) => `Step ${c} of ${t}`,
    },
    steps: [
      {
        title: 'What is Hermes?',
        body:
          'Hermes is the flagship agent from AI Evolution Labs. It understands your company context, uses tools, remembers prior conversations, and takes steps on its own to deliver the result.',
        highlights: [
          'Autonomous — it doesn\'t just answer, it executes',
          'Memory — your preferences, clients, projects',
          'Connects to your stack — Notion, Gmail, Slack, GitHub, and more',
        ],
      },
      {
        title: 'What it can do for your business',
        body:
          'Four flagship workflows are built into the home screen — one click and you are off.',
        highlights: [
          'Client brief / proposal — full proposal from 3 questions',
          'Business report / analysis — KPIs, weekly recap',
          'Workflow automation — multi-step recipes with cron + MCP',
          'Market intelligence — competitor scan, due diligence',
        ],
      },
      {
        title: 'How to use it',
        body:
          'Everything is in the side menu. Talk naturally — Hermes picks the right tools.',
        highlights: [
          'Chat — your daily conversation with the agent',
          'Conductor — break a goal into a mission, delegate sub-tasks',
          'Swarm — many agents in parallel for bigger projects',
          'Skills + MCP — skills library and integrations',
        ],
      },
      {
        title: 'Ready to start?',
        body:
          'Launch a sample task — Hermes will ask for 3 inputs and produce a ready-to-send client brief.',
        highlights: [],
      },
    ],
    ctaSampleTask: {
      label: 'Start with a sample client brief',
      prompt:
        'Hi Hermes. Let\'s do a full client brief. Ask me 3 short questions (industry, goal, budget band), then produce a 1-page proposal: problem, approach (3 phases), deliverables, timeline, price band. Executive tone.',
    },
    langPickerLabel: 'Language',
  },
  es: {
    brandLabel: 'AI Evolution Labs · Hermes',
    tagline: 'Tu negocio. Automatizado.',
    welcome: {
      title: 'Bienvenido a Hermes',
      subtitle:
        'No es otro chatbot. Es un agente de IA que realmente trabaja para tu negocio — briefs, informes, automatizaciones, research.',
      ctaStart: 'Empezar',
      ctaSkip: 'Saltar',
      ctaNext: 'Siguiente',
      ctaPrev: 'Atrás',
      ctaFinish: 'Lanzar mi primera tarea',
      stepLabel: (c, t) => `Paso ${c} de ${t}`,
    },
    steps: [
      {
        title: '¿Qué es Hermes?',
        body:
          'Hermes es el agente insignia de AI Evolution Labs. Entiende el contexto de tu empresa, usa herramientas, recuerda conversaciones anteriores y actúa por su cuenta para entregar el resultado.',
        highlights: [
          'Autónomo — no solo responde, ejecuta',
          'Memoria — tus preferencias, clientes, proyectos',
          'Se conecta a tu stack — Notion, Gmail, Slack, GitHub y más',
        ],
      },
      {
        title: 'Qué puede hacer por tu negocio',
        body:
          'Cuatro flujos insignia integrados en la pantalla principal — un clic y empiezas.',
        highlights: [
          'Brief de cliente / propuesta — propuesta completa desde 3 preguntas',
          'Informe / análisis de negocio — KPIs, resumen semanal',
          'Automatización — recetas multi-paso con cron + MCP',
          'Inteligencia de mercado — análisis de competencia, due diligence',
        ],
      },
      {
        title: 'Cómo usarlo',
        body:
          'Todo está en el menú lateral. Habla con naturalidad — Hermes elige las herramientas adecuadas.',
        highlights: [
          'Chat — conversación diaria con el agente',
          'Conductor — descompone un objetivo en misión y subtareas',
          'Swarm — muchos agentes en paralelo para proyectos grandes',
          'Skills + MCP — biblioteca de habilidades e integraciones',
        ],
      },
      {
        title: '¿Listo para empezar?',
        body:
          'Lanza una tarea de ejemplo — Hermes pedirá 3 datos y producirá un brief de cliente listo para enviar.',
        highlights: [],
      },
    ],
    ctaSampleTask: {
      label: 'Empieza con un brief de cliente de ejemplo',
      prompt:
        'Hola Hermes. Hagamos un brief de cliente completo. Hazme 3 preguntas cortas (industria, objetivo, banda de presupuesto), luego produce una propuesta de 1 página: problema, enfoque (3 fases), entregables, calendario, banda de precio. Tono ejecutivo. En español.',
    },
    langPickerLabel: 'Idioma',
  },
  de: {
    brandLabel: 'AI Evolution Labs · Hermes',
    tagline: 'Dein Business. Automatisiert.',
    welcome: {
      title: 'Willkommen bei Hermes',
      subtitle:
        'Kein weiterer Chatbot. Ein KI-Agent, der wirklich Arbeit für dein Unternehmen erledigt — Briefings, Reports, Automatisierungen, Research.',
      ctaStart: 'Starten',
      ctaSkip: 'Überspringen',
      ctaNext: 'Weiter',
      ctaPrev: 'Zurück',
      ctaFinish: 'Erste Aufgabe starten',
      stepLabel: (c, t) => `Schritt ${c} von ${t}`,
    },
    steps: [
      {
        title: 'Was ist Hermes?',
        body:
          'Hermes ist der Flaggschiff-Agent von AI Evolution Labs. Er versteht den Kontext deines Unternehmens, nutzt Tools, erinnert sich an frühere Gespräche und handelt eigenständig, um Ergebnisse zu liefern.',
        highlights: [
          'Autonom — antwortet nicht nur, sondern führt aus',
          'Speicher — deine Präferenzen, Kunden, Projekte',
          'Verbindet sich mit deinem Stack — Notion, Gmail, Slack, GitHub & mehr',
        ],
      },
      {
        title: 'Was er für dein Business kann',
        body:
          'Vier Flaggschiff-Workflows sind direkt auf dem Startbildschirm verfügbar — ein Klick und los geht\'s.',
        highlights: [
          'Kundenbriefing / Angebot — vollständiges Angebot aus 3 Fragen',
          'Business-Report / Analyse — KPIs, Wochenrückblick',
          'Workflow-Automatisierung — mehrstufige Rezepte mit Cron + MCP',
          'Markt-Intelligenz — Wettbewerbsanalyse, Due Diligence',
        ],
      },
      {
        title: 'Wie du es nutzt',
        body:
          'Alles befindet sich im Seitenmenü. Sprich natürlich — Hermes wählt die passenden Tools.',
        highlights: [
          'Chat — tägliches Gespräch mit dem Agenten',
          'Conductor — Ziel in Mission und Teilaufgaben zerlegen',
          'Swarm — viele Agenten parallel für größere Projekte',
          'Skills + MCP — Skill-Bibliothek und Integrationen',
        ],
      },
      {
        title: 'Bereit zu starten?',
        body:
          'Starte eine Beispielaufgabe — Hermes fragt nach 3 Eingaben und erstellt ein versandfertiges Kundenbriefing.',
        highlights: [],
      },
    ],
    ctaSampleTask: {
      label: 'Beginne mit einem Beispiel-Kundenbriefing',
      prompt:
        'Hallo Hermes. Lass uns ein vollständiges Kundenbriefing machen. Stell mir 3 kurze Fragen (Branche, Ziel, Budgetrahmen), und erstelle dann ein 1-seitiges Angebot: Problem, Ansatz (3 Phasen), Deliverables, Timeline, Preisrahmen. Executive-Ton. Auf Deutsch.',
    },
    langPickerLabel: 'Sprache',
  },
  fr: {
    brandLabel: 'AI Evolution Labs · Hermes',
    tagline: 'Votre business. Automatisé.',
    welcome: {
      title: 'Bienvenue dans Hermes',
      subtitle:
        'Pas un énième chatbot. Un agent IA qui fait vraiment le travail pour votre business — briefs, rapports, automatisations, research.',
      ctaStart: 'Commencer',
      ctaSkip: 'Passer',
      ctaNext: 'Suivant',
      ctaPrev: 'Retour',
      ctaFinish: 'Lancer ma première tâche',
      stepLabel: (c, t) => `Étape ${c} sur ${t}`,
    },
    steps: [
      {
        title: 'Qu\'est-ce que Hermes ?',
        body:
          'Hermes est l\'agent phare d\'AI Evolution Labs. Il comprend le contexte de votre entreprise, utilise des outils, se souvient des conversations précédentes et agit de lui-même pour livrer le résultat.',
        highlights: [
          'Autonome — il ne répond pas, il exécute',
          'Mémoire — vos préférences, clients, projets',
          'Se connecte à votre stack — Notion, Gmail, Slack, GitHub et plus',
        ],
      },
      {
        title: 'Ce qu\'il peut faire pour votre business',
        body:
          'Quatre workflows phares intégrés à l\'écran d\'accueil — un clic et c\'est parti.',
        highlights: [
          'Brief client / proposition — proposition complète à partir de 3 questions',
          'Rapport / analyse business — KPIs, récap hebdomadaire',
          'Automatisation — recettes multi-étapes avec cron + MCP',
          'Veille marché — analyse concurrentielle, due diligence',
        ],
      },
      {
        title: 'Comment l\'utiliser',
        body:
          'Tout est dans le menu latéral. Parlez naturellement — Hermes choisit les bons outils.',
        highlights: [
          'Chat — conversation quotidienne avec l\'agent',
          'Conductor — décompose un objectif en mission et sous-tâches',
          'Swarm — plusieurs agents en parallèle pour les gros projets',
          'Skills + MCP — bibliothèque de compétences et intégrations',
        ],
      },
      {
        title: 'Prêt à commencer ?',
        body:
          'Lancez une tâche d\'exemple — Hermes demandera 3 informations et produira un brief client prêt à envoyer.',
        highlights: [],
      },
    ],
    ctaSampleTask: {
      label: 'Démarrer avec un exemple de brief client',
      prompt:
        'Salut Hermes. Faisons un brief client complet. Pose-moi 3 questions courtes (secteur, objectif, fourchette de budget), puis produis une proposition d\'1 page : problème, approche (3 phases), livrables, calendrier, fourchette de prix. Ton exécutif. En français.',
    },
    langPickerLabel: 'Langue',
  },
}

export function detectBrowserLang(): OnboardingLang {
  if (typeof navigator === 'undefined') return 'en'
  const raw = (navigator.language || 'en').toLowerCase()
  const prefix = raw.split('-')[0] as OnboardingLang
  return ONBOARDING_LANGS.some((l) => l.id === prefix) ? prefix : 'en'
}
