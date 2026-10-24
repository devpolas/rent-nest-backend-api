export type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "about-rentnest",
    title: "About RentNest",
    keywords: ["rentnest", "platform", "about", "rental", "marketplace"],
    content:
      "RentNest is a rental property marketplace that helps tenants discover properties and landlords manage property listings and rental requests.",
  },
  {
    id: "property-search",
    title: "Finding properties",
    keywords: [
      "property",
      "properties",
      "search",
      "rent",
      "bedroom",
      "location",
      "apartment",
      "flat",
      "house",
    ],
    content:
      "Tenants can search available approved property listings and compare their rent, location, bedrooms, bathrooms, area, amenities, and images. Listing details should be checked before submitting a rental request.",
  },
  {
    id: "rental-requests",
    title: "Rental requests",
    keywords: [
      "request",
      "rental request",
      "tenant",
      "landlord",
      "move in",
      "lease",
      "booking",
    ],
    content:
      "RentNest supports rental requests between tenants and landlords. A tenant can request a property, and the landlord handles the request through the platform. The AI assistant must not claim to submit or approve requests.",
  },
  {
    id: "payments",
    title: "Payments",
    keywords: [
      "payment",
      "stripe",
      "pay",
      "transaction",
      "refund",
      "security deposit",
    ],
    content:
      "RentNest includes payment functionality. Payment status and transaction outcomes must be read from the actual platform rather than inferred by the AI assistant. The assistant must never claim that a payment succeeded unless verified by the backend.",
  },
  {
    id: "accounts",
    title: "Accounts and security",
    keywords: [
      "account",
      "login",
      "password",
      "security",
      "tenant",
      "landlord",
      "profile",
    ],
    content:
      "RentNest has tenant and landlord roles, with moderator and admin roles for platform management. Account access and permissions are enforced by the backend. The AI assistant must not bypass authentication or authorization.",
  },
  {
    id: "reviews",
    title: "Property reviews",
    keywords: ["review", "rating", "stars", "feedback"],
    content:
      "RentNest supports property reviews and ratings. The assistant should use actual property review information when available and must not fabricate reviews, ratings, or tenant experiences.",
  },
];

export function getKnowledgeDocuments(): KnowledgeDocument[] {
  return knowledgeDocuments;
}
