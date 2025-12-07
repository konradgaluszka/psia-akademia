export type Locale = "PL" | "EN";

export type Messages = (typeof translations)[Locale];

export const translations = {
  EN: {
    nav: {
      events: "Events",
      about: "About us",
      contact: "Contact",
      login: "Login",
      join: "Join",
      brandTop: "Dog",
      brandBottom: "Academy"
    },
    hero: {
      eyebrow: "Training • Events • Care",
      title: "Book courses and meetings for your dog with trusted trainers.",
      description:
        "Browse curated sessions across obedience, agility, and personalized consults. Real-time availability, transparent pricing, and fast booking powered by our academy.",
      ctaFind: "Find an event",
      ctaFeatured: "View featured course",
      statAvailabilityLabel: "Availability",
      statAvailabilityValue: "Same-week slots",
      statAvailabilityDescription: "Reserve instantly without back-and-forth.",
      statTrainersLabel: "Trainers",
      statTrainersValue: "Vetted experts",
      statTrainersDescription:
        "Behaviorists and agility coaches with proven programs.",
      searchLabel: "Quick search",
      searchTitle: "Find the right fit",
      searchDescription: "Filter by goal, energy level, or trainer preference.",
      searchNeedLabel: "What do you need?",
      searchNeedPlaceholder: "Puppy basics, agility, behavior...",
      searchDayLabel: "Day",
      searchDayOptions: ["Any day", "Weekday", "Weekend"],
      searchFormatLabel: "Format",
      searchFormatOptions: ["Any", "Group class", "1:1 Session"],
      searchSubmit: "Search availability"
    },
    featuredSection: {
      title: "Featured events",
      viewAll: "View all",
      viewDetails: "View details"
    },
    featuredEvents: [
      {
        id: "puppy-basics",
        title: "Puppy Basics",
        time: "Sat • 10:00 AM",
        location: "Outdoor yard",
        price: "$45",
        tags: ["Group class", "Beginner"]
      },
      {
        id: "agility-fun",
        title: "Agility Fun Run",
        time: "Sun • 2:00 PM",
        location: "Arena A",
        price: "$65",
        tags: ["Intermediate", "High energy"]
      },
      {
        id: "behavior-1on1",
        title: "Behavior Consult (1:1)",
        time: "Weekdays • by appt",
        location: "Training room",
        price: "$95",
        tags: ["Private", "Tailored plan"]
      }
    ]
  },
  PL: {
    nav: {
      events: "Wydarzenia",
      about: "O nas",
      contact: "Kontakt",
      login: "Zaloguj się",
      join: "Dołącz",
      brandTop: "Psi",
      brandBottom: "Akademia"
    },
    hero: {
      eyebrow: "Szkolenia • Wydarzenia • Opieka",
      title:
        "Rezerwuj kursy i spotkania dla swojego psa z zaufanymi trenerami.",
      description:
        "Przeglądaj zajęcia z posłuszeństwa, agility i konsultacje behawioralne. Bieżąca dostępność, jasne ceny i szybkie rezerwacje wspierane przez naszą akademię.",
      ctaFind: "Znajdź wydarzenie",
      ctaFeatured: "Zobacz polecany kurs",
      statAvailabilityLabel: "Dostępność",
      statAvailabilityValue: "Terminy w tym tygodniu",
      statAvailabilityDescription: "Rezerwuj od razu, bez wymiany maili.",
      statTrainersLabel: "Trenerzy",
      statTrainersValue: "Sprawdzeni eksperci",
      statTrainersDescription:
        "Behawioryści i trenerzy agility z dopracowanymi programami.",
      searchLabel: "Szybkie wyszukiwanie",
      searchTitle: "Znajdź najlepsze dopasowanie",
      searchDescription:
        "Filtruj po celu, poziomie energii lub preferencjach trenera.",
      searchNeedLabel: "Czego potrzebujesz?",
      searchNeedPlaceholder: "Podstawy szczeniąt, agility, behawior...",
      searchDayLabel: "Dzień",
      searchDayOptions: ["Dowolny dzień", "Dzień roboczy", "Weekend"],
      searchFormatLabel: "Format",
      searchFormatOptions: ["Dowolny", "Zajęcia grupowe", "Sesja 1:1"],
      searchSubmit: "Sprawdź dostępność"
    },
    featuredSection: {
      title: "Polecane wydarzenia",
      viewAll: "Zobacz wszystkie",
      viewDetails: "Szczegóły"
    },
    featuredEvents: [
      {
        id: "puppy-basics",
        title: "Podstawy dla szczeniąt",
        time: "Sob. • 10:00",
        location: "Plac zewnętrzny",
        price: "45 $",
        tags: ["Grupa", "Początkujący"]
      },
      {
        id: "agility-fun",
        title: "Agility — bieg na luzie",
        time: "Ndz. • 14:00",
        location: "Arena A",
        price: "65 $",
        tags: ["Średniozaawans.", "Dużo energii"]
      },
      {
        id: "behavior-1on1",
        title: "Konsultacja behawioralna (1:1)",
        time: "Dni robocze • umów",
        location: "Sala treningowa",
        price: "95 $",
        tags: ["Indywidualnie", "Plan na miarę"]
      }
    ]
  }
} as const;
