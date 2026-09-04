import type { SiteLanguage } from "@/lib/i18n";

/** Textos de UI fijos (no vienen del CMS). */
export type UiMessages = {
  nav: {
    home: string;
    properties: string;
    club: string;
    about: string;
    more: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
    menu: string;
  };
  common: {
    bookNow: string;
    loading: string;
    submit: string;
    sending: string;
    thanks: string;
    errorGeneric: string;
    designedBy: string;
    clear: string;
    loadingVerification: string;
    close: string;
  };
  marketing: {
    notNow: string;
    closePopup: string;
    closeAnnouncement: string;
    announcementAria: string;
  };
  newsletter: {
    aria: string;
    email: string;
    project: string;
    chooseProject: string;
    emailPlaceholder: string;
    success: string;
    invalidEmail: string;
    chooseProjectError: string;
  };
  corporateForm: {
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    phone: string;
    success: string;
  };
  properties: {
    comingSoon: string;
    units: string;
    guests: string;
    tour360: string;
    related: string;
    filters: string;
    all: string;
    aboutBuilding: string;
    bookNowArrow: string;
    viewDetails: string;
    viewProperty: string;
    offer: string;
    popular: string;
    highlights: string;
    clearFilters: string;
    emptyTitle: string;
    emptyHint: string;
    filterAria: string;
    location: string;
    neighborhood: string;
    category: string;
    allNeighborhoods: string;
    allTypologies: string;
    closeFilters: string;
  };
  reviews: {
    title: string;
    intro: string;
    empty: string;
    leaveReview: string;
    success: string;
    name: string;
    namePlaceholder: string;
    ratingOptional: string;
    noRating: string;
    rating5: string;
    rating4: string;
    rating3: string;
    rating2: string;
    rating1: string;
    comment: string;
    commentPlaceholder: string;
    submit: string;
    turnstileRequired: string;
    starsOf5: string;
  };
  realEstate: {
    location: string;
    neighborhood: string;
    units: string;
    typologies: string;
    role: string;
    differentials: string;
  };
  reservas: {
    title: string;
    description: string;
    engineError: string;
    engineErrorHint: string;
    retry: string;
    contact: string;
    loadingEngine: string;
    connecting: string;
    destination: string;
    dates: string;
    guests: string;
    confirmation: string;
    engineAria: string;
  };
  blog: {
    empty: string;
    breadcrumb: string;
    byAuthor: string;
    more: string;
  };
  googleReviews: {
    title: string;
  };
};

const ES: UiMessages = {
  nav: {
    home: "Inicio",
    properties: "Propiedades",
    club: "Club",
    about: "Nosotros",
    more: "Más",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    mainNav: "Navegación principal",
    menu: "Menú",
  },
  common: {
    bookNow: "Reservar ahora",
    loading: "Cargando…",
    submit: "Enviar",
    sending: "Enviando…",
    thanks: "¡Gracias!",
    errorGeneric: "Algo salió mal. Probá de nuevo.",
    designedBy: "Diseño y desarrollo web por",
    clear: "Limpiar",
    loadingVerification: "Cargando verificación…",
    close: "Cerrar",
  },
  marketing: {
    notNow: "Ahora no",
    closePopup: "Cerrar popup",
    closeAnnouncement: "Cerrar anuncio",
    announcementAria: "Anuncio",
  },
  newsletter: {
    aria: "Formulario para recibir novedades sobre desarrollos",
    email: "Email",
    project: "Proyecto",
    chooseProject: "Elegí un proyecto",
    emailPlaceholder: "Dejá tu email para recibir novedades",
    success: "¡Gracias! Te avisaremos cuando haya novedades.",
    invalidEmail: "Ingresá tu email.",
    chooseProjectError: "Seleccioná un proyecto.",
  },
  corporateForm: {
    company: "Empresa",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Email",
    jobTitle: "Cargo",
    phone: "Teléfono",
    success:
      "Gracias. Recibimos tu solicitud y nos pondremos en contacto a la brevedad.",
  },
  properties: {
    comingSoon: "Próximamente",
    units: "Unidades",
    guests: "Huéspedes",
    tour360: "Tour 360°",
    related: "Otras propiedades",
    filters: "Filtros",
    all: "Todas",
    aboutBuilding: "Sobre el edificio",
    bookNowArrow: "Reservar ahora →",
    viewDetails: "Ver detalles →",
    viewProperty: "Ver",
    offer: "Oferta",
    popular: "Más solicitada",
    highlights: "Destacados de la propiedad",
    clearFilters: "Limpiar filtros",
    emptyTitle: "No hay departamentos con estos filtros",
    emptyHint:
      "Probá con otro barrio o tipología, o restablecé los filtros para ver todas las opciones.",
    filterAria: "Filtrar propiedades",
    location: "Ubicación",
    neighborhood: "Barrio",
    category: "Categoría",
    allNeighborhoods: "Todos los barrios",
    allTypologies: "Todas las tipologías",
    closeFilters: "Cerrar filtros",
  },
  reviews: {
    title: "Comentarios",
    intro:
      "Contanos tu experiencia en {name}. Los comentarios se publican tras una revisión del equipo.",
    empty: "Todavía no hay comentarios publicados.",
    leaveReview: "Dejá tu comentario",
    success:
      "Gracias. Tu comentario fue recibido y lo revisaremos antes de publicarlo.",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    ratingOptional: "Valoración (opcional)",
    noRating: "Sin valoración",
    rating5: "5 — Excelente",
    rating4: "4 — Muy bueno",
    rating3: "3 — Bueno",
    rating2: "2 — Regular",
    rating1: "1 — Malo",
    comment: "Comentario",
    commentPlaceholder:
      "¿Qué te pareció el edificio, la ubicación, el servicio?",
    submit: "Enviar comentario",
    turnstileRequired: "Completá la verificación anti-spam.",
    starsOf5: "{value} de 5",
  },
  realEstate: {
    location: "Ubicación",
    neighborhood: "Barrio",
    units: "Unidades",
    typologies: "Tipologías",
    role: "Rol",
    differentials: "Diferenciales",
  },
  reservas: {
    title: "Reservas",
    description: "Motor de reservas con todos los establecimientos Top Rentals.",
    engineError: "No pudimos cargar el motor de reservas",
    engineErrorHint:
      "Puede deberse a la conexión o a una demora del proveedor. Intentá de nuevo o contactanos.",
    retry: "Reintentar",
    contact: "Contacto",
    loadingEngine: "Cargando motor de reservas…",
    connecting: "Conectando con Top Rentals — unos segundos",
    destination: "Destino",
    dates: "Fechas",
    guests: "Huéspedes",
    confirmation: "Confirmación",
    engineAria: "Motor de reservas",
  },
  blog: {
    empty: "Próximamente publicaremos nuevas entradas.",
    breadcrumb: "Miga de pan",
    byAuthor: "Por {name}",
    more: "Más en el blog",
  },
  googleReviews: {
    title: "Lo que dicen de nosotros",
  },
};

const EN: UiMessages = {
  nav: {
    home: "Home",
    properties: "Properties",
    club: "Club",
    about: "About",
    more: "More",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
    menu: "Menu",
  },
  common: {
    bookNow: "Book now",
    loading: "Loading…",
    submit: "Submit",
    sending: "Sending…",
    thanks: "Thank you!",
    errorGeneric: "Something went wrong. Please try again.",
    designedBy: "Web design and development by",
    clear: "Clear",
    loadingVerification: "Loading verification…",
    close: "Close",
  },
  marketing: {
    notNow: "Not now",
    closePopup: "Close popup",
    closeAnnouncement: "Close announcement",
    announcementAria: "Announcement",
  },
  newsletter: {
    aria: "Form to receive updates about developments",
    email: "Email",
    project: "Project",
    chooseProject: "Choose a project",
    emailPlaceholder: "Enter your email for updates",
    success: "Thank you! We'll let you know when there's news.",
    invalidEmail: "Please enter your email.",
    chooseProjectError: "Please select a project.",
  },
  corporateForm: {
    company: "Company",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    jobTitle: "Job title",
    phone: "Phone",
    success: "Thank you. We received your request and will contact you shortly.",
  },
  properties: {
    comingSoon: "Coming soon",
    units: "Units",
    guests: "Guests",
    tour360: "360° tour",
    related: "Other properties",
    filters: "Filters",
    all: "All",
    aboutBuilding: "About the building",
    bookNowArrow: "Book now →",
    viewDetails: "View details →",
    viewProperty: "View",
    offer: "Offer",
    popular: "Most requested",
    highlights: "Property highlights",
    clearFilters: "Clear filters",
    emptyTitle: "No apartments match these filters",
    emptyHint:
      "Try another neighborhood or typology, or reset the filters to see all options.",
    filterAria: "Filter properties",
    location: "Location",
    neighborhood: "Neighborhood",
    category: "Category",
    allNeighborhoods: "All neighborhoods",
    allTypologies: "All typologies",
    closeFilters: "Close filters",
  },
  reviews: {
    title: "Reviews",
    intro:
      "Tell us about your stay at {name}. Reviews are published after our team reviews them.",
    empty: "No reviews published yet.",
    leaveReview: "Leave a review",
    success: "Thank you. Your review was received and we'll review it before publishing.",
    name: "Name",
    namePlaceholder: "Your name",
    ratingOptional: "Rating (optional)",
    noRating: "No rating",
    rating5: "5 — Excellent",
    rating4: "4 — Very good",
    rating3: "3 — Good",
    rating2: "2 — Fair",
    rating1: "1 — Poor",
    comment: "Comment",
    commentPlaceholder: "How was the building, location, and service?",
    submit: "Submit review",
    turnstileRequired: "Please complete the anti-spam check.",
    starsOf5: "{value} out of 5",
  },
  realEstate: {
    location: "Location",
    neighborhood: "Neighborhood",
    units: "Units",
    typologies: "Typologies",
    role: "Role",
    differentials: "Highlights",
  },
  reservas: {
    title: "Bookings",
    description: "Booking engine with all Top Rentals properties.",
    engineError: "We couldn't load the booking engine",
    engineErrorHint:
      "This may be due to your connection or a provider delay. Please try again or contact us.",
    retry: "Try again",
    contact: "Contact",
    loadingEngine: "Loading booking engine…",
    connecting: "Connecting to Top Rentals — just a moment",
    destination: "Destination",
    dates: "Dates",
    guests: "Guests",
    confirmation: "Confirmation",
    engineAria: "Booking engine",
  },
  blog: {
    empty: "New posts coming soon.",
    breadcrumb: "Breadcrumb",
    byAuthor: "By {name}",
    more: "More from the blog",
  },
  googleReviews: {
    title: "What people say about us",
  },
};

export function getUiMessages(lang: SiteLanguage): UiMessages {
  return lang === "en" ? EN : ES;
}
