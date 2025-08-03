import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de' | 'it' | 'es' | 'ru';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Header
  'header.browseLuggage': {
    en: 'Browse Luggage',
    de: 'Gepäck durchsuchen',
    it: 'Sfoglia Bagagli',
    es: 'Explorar Equipaje',
    ru: 'Просмотр багажа'
  },
  'header.becomeHost': {
    en: 'Become a Host',
    de: 'Gastgeber werden',
    it: 'Diventa Host',
    es: 'Conviértete en Anfitrión',
    ru: 'Стать хостом'
  },
  'header.howItWorks': {
    en: 'How it Works',
    de: 'Wie es funktioniert',
    it: 'Come Funziona',
    es: 'Cómo Funciona',
    ru: 'Как это работает'
  },
  'header.support': {
    en: 'Support',
    de: 'Support',
    it: 'Supporto',
    es: 'Soporte',
    ru: 'Поддержка'
  },
  'header.login': {
    en: 'Log in',
    de: 'Anmelden',
    it: 'Accedi',
    es: 'Iniciar Sesión',
    ru: 'Войти'
  },
  'header.signup': {
    en: 'Sign up',
    de: 'Registrieren',
    it: 'Iscriviti',
    es: 'Registrarse',
    ru: 'Регистрация'
  },
  'header.host': {
    en: 'Host',
    de: 'Gastgeber',
    it: 'Host',
    es: 'Anfitrión',
    ru: 'Хост'
  },
  
  // Homepage
  'home.hero.title': {
    en: 'Travel Light.\nPack Smart.',
    de: 'Reise leicht.\nPacke klug.',
    it: 'Viaggia Leggero.\nPacked Smart.',
    es: 'Viaja Ligero.\nEmpaca Inteligente.',
    ru: 'Путешествуй налегке.\nУпаковывайся умно.'
  },
  'home.hero.subtitle': {
    en: 'Rent premium luggage storage at your destination. Skip the airline fees, avoid dragging heavy bags, and travel with confidence.',
    de: 'Mieten Sie Premium-Gepäckaufbewahrung an Ihrem Zielort. Überspringen Sie Fluggesellschaftsgebühren, vermeiden Sie schwere Taschen und reisen Sie mit Vertrauen.',
    it: 'Affitta deposito bagagli premium alla tua destinazione. Salta le tariffe aeree, evita di trascinare borse pesanti e viaggia con fiducia.',
    es: 'Alquila almacenamiento de equipaje premium en tu destino. Omite las tarifas de aerolíneas, evita arrastrar bolsas pesadas y viaja con confianza.',
    ru: 'Арендуйте премиум хранение багажа в месте назначения. Избегайте авиационных сборов, не таскайте тяжелые сумки и путешествуйте с уверенностью.'
  },
  
  // Search
  'search.where': {
    en: 'Where',
    de: 'Wo',
    it: 'Dove',
    es: 'Dónde',
    ru: 'Где'
  },
  'search.pickup': {
    en: 'Pickup',
    de: 'Abholung',
    it: 'Ritiro',
    es: 'Recogida',
    ru: 'Получение'
  },
  'search.return': {
    en: 'Return',
    de: 'Rückgabe',
    it: 'Ritorno',
    es: 'Devolución',
    ru: 'Возврат'
  },
  'search.search': {
    en: 'Search',
    de: 'Suchen',
    it: 'Cerca',
    es: 'Buscar',
    ru: 'Поиск'
  },
  
  // Categories
  'category.garage': {
    en: 'Garage',
    de: 'Garage',
    it: 'Garage',
    es: 'Garaje',
    ru: 'Гараж'
  },
  'category.shed': {
    en: 'Shed',
    de: 'Schuppen',
    it: 'Capannone',
    es: 'Cobertizo',
    ru: 'Сарай'
  },
  'category.pantry': {
    en: 'Pantry',
    de: 'Speisekammer',
    it: 'Dispensa',
    es: 'Despensa',
    ru: 'Кладовая'
  },
  'category.cell': {
    en: 'Storage Cell',
    de: 'Lagerzelle',
    it: 'Cella di Deposito',
    es: 'Celda de Almacenamiento',
    ru: 'Камера хранения'
  },
  'category.container': {
    en: 'Container',
    de: 'Container',
    it: 'Container',
    es: 'Contenedor',
    ru: 'Контейнер'
  },
  'category.largeSpace': {
    en: 'Large Space',
    de: 'Großer Raum',
    it: 'Spazio Grande',
    es: 'Espacio Grande',
    ru: 'Большое пространство'
  },
  
  // Time periods
  'period.1month': {
    en: '1 Month',
    de: '1 Monat',
    it: '1 Mese',
    es: '1 Mes',
    ru: '1 месяц'
  },
  'period.3months': {
    en: '3 Months',
    de: '3 Monate',
    it: '3 Mesi',
    es: '3 Meses',
    ru: '3 месяца'
  },
  'period.6months': {
    en: '6 Months',
    de: '6 Monate',
    it: '6 Mesi',
    es: '6 Meses',
    ru: '6 месяцев'
  },
  'period.1year': {
    en: '1 Year',
    de: '1 Jahr',
    it: '1 Anno',
    es: '1 Año',
    ru: '1 год'
  },
  'period.more': {
    en: 'More',
    de: 'Mehr',
    it: 'Più',
    es: 'Más',
    ru: 'Больше'
  },
  
  // Common
  'common.book': {
    en: 'Book',
    de: 'Buchen',
    it: 'Prenota',
    es: 'Reservar',
    ru: 'Забронировать'
  },
  'common.contact': {
    en: 'Contact',
    de: 'Kontakt',
    it: 'Contatto',
    es: 'Contacto',
    ru: 'Контакт'
  },
  'common.cancel': {
    en: 'Cancel',
    de: 'Abbrechen',
    it: 'Annulla',
    es: 'Cancelar',
    ru: 'Отмена'
  },
  'common.pay': {
    en: 'Pay',
    de: 'Bezahlen',
    it: 'Paga',
    es: 'Pagar',
    ru: 'Платить'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
