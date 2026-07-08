import prisma from "../src/lib/prisma";

const propertyCategories = [
  {
    name: "Apartment",
    slug: "apartment",
    icon: "https://img.icons8.com/fluency/96/apartment.png",
  },
  {
    name: "Basement Apartment",
    slug: "basement-apartment",
    icon: "https://img.icons8.com/fluency/96/basement.png",
  },
  {
    name: "Boarding House",
    slug: "boarding-house",
    icon: "https://img.icons8.com/fluency/96/hostel.png",
  },
  {
    name: "Bungalow",
    slug: "bungalow",
    icon: "https://img.icons8.com/fluency/96/bungalow.png",
  },
  {
    name: "Cabin",
    slug: "cabin",
    icon: "https://img.icons8.com/fluency/96/log-cabin.png",
  },
  {
    name: "Castle",
    slug: "castle",
    icon: "https://img.icons8.com/fluency/96/castle.png",
  },
  {
    name: "Chalet",
    slug: "chalet",
    icon: "https://img.icons8.com/fluency/96/chalet.png",
  },
  {
    name: "Co-Living Space",
    slug: "co-living-space",
    icon: "https://img.icons8.com/fluency/96/living-room.png",
  },
  {
    name: "Commercial Building",
    slug: "commercial-building",
    icon: "https://img.icons8.com/fluency/96/commercial.png",
  },
  {
    name: "Commercial Plot",
    slug: "commercial-plot",
    icon: "https://img.icons8.com/fluency/96/land-sales.png",
  },
  {
    name: "Commercial Space",
    slug: "commercial-space",
    icon: "https://img.icons8.com/fluency/96/business-building.png",
  },
  {
    name: "Condominium",
    slug: "condominium",
    icon: "https://img.icons8.com/fluency/96/condominium.png",
  },
  {
    name: "Container Home",
    slug: "container-home",
    icon: "https://img.icons8.com/fluency/96/container.png",
  },
  {
    name: "Cottage",
    slug: "cottage",
    icon: "https://img.icons8.com/fluency/96/cottage.png",
  },
  {
    name: "Detached House",
    slug: "detached-house",
    icon: "https://img.icons8.com/fluency/96/home.png",
  },
  {
    name: "Dormitory",
    slug: "dormitory",
    icon: "https://img.icons8.com/fluency/96/dormitory.png",
  },
  {
    name: "Duplex",
    slug: "duplex",
    icon: "https://img.icons8.com/fluency/96/duplex-house.png",
  },
  {
    name: "Factory",
    slug: "factory",
    icon: "https://img.icons8.com/fluency/96/factory.png",
  },
  {
    name: "Farm",
    slug: "farm",
    icon: "https://img.icons8.com/fluency/96/farm.png",
  },
  {
    name: "Farmhouse",
    slug: "farmhouse",
    icon: "https://img.icons8.com/fluency/96/farm-house.png",
  },
  {
    name: "Flat",
    slug: "flat",
    icon: "https://img.icons8.com/fluency/96/apartment.png",
  },
  {
    name: "Garage",
    slug: "garage",
    icon: "https://img.icons8.com/fluency/96/garage.png",
  },
  {
    name: "Guest House",
    slug: "guest-house",
    icon: "https://img.icons8.com/fluency/96/guest-house.png",
  },
  {
    name: "Holiday Home",
    slug: "holiday-home",
    icon: "https://img.icons8.com/fluency/96/holiday-home.png",
  },
  {
    name: "Hostel",
    slug: "hostel",
    icon: "https://img.icons8.com/fluency/96/hostel.png",
  },
  {
    name: "Hotel Room",
    slug: "hotel-room",
    icon: "https://img.icons8.com/fluency/96/hotel-room.png",
  },
  {
    name: "House",
    slug: "house",
    icon: "https://img.icons8.com/fluency/96/home.png",
  },
  {
    name: "Industrial Building",
    slug: "industrial-building",
    icon: "https://img.icons8.com/fluency/96/factory.png",
  },
  {
    name: "Industrial Space",
    slug: "industrial-space",
    icon: "https://img.icons8.com/fluency/96/warehouse.png",
  },
  {
    name: "Land",
    slug: "land",
    icon: "https://img.icons8.com/fluency/96/land-sales.png",
  },
  {
    name: "Loft",
    slug: "loft",
    icon: "https://img.icons8.com/fluency/96/loft.png",
  },
  {
    name: "Mansion",
    slug: "mansion",
    icon: "https://img.icons8.com/fluency/96/mansion.png",
  },
  {
    name: "Mobile Home",
    slug: "mobile-home",
    icon: "https://img.icons8.com/fluency/96/mobile-home.png",
  },
  {
    name: "Office",
    slug: "office",
    icon: "https://img.icons8.com/fluency/96/office.png",
  },
  {
    name: "Office Floor",
    slug: "office-floor",
    icon: "https://img.icons8.com/fluency/96/office-building.png",
  },
  {
    name: "Parking Space",
    slug: "parking-space",
    icon: "https://img.icons8.com/fluency/96/parking.png",
  },
  {
    name: "Penthouse",
    slug: "penthouse",
    icon: "https://img.icons8.com/fluency/96/penthouse.png",
  },
  {
    name: "Private Room",
    slug: "private-room",
    icon: "https://img.icons8.com/fluency/96/room.png",
  },
  {
    name: "Residential Plot",
    slug: "residential-plot",
    icon: "https://img.icons8.com/fluency/96/land-sales.png",
  },
  {
    name: "Retail Shop",
    slug: "retail-shop",
    icon: "https://img.icons8.com/fluency/96/shop.png",
  },
  {
    name: "Semi-Detached House",
    slug: "semi-detached-house",
    icon: "https://img.icons8.com/fluency/96/home.png",
  },
  {
    name: "Serviced Apartment",
    slug: "serviced-apartment",
    icon: "https://img.icons8.com/fluency/96/apartment.png",
  },
  {
    name: "Shared Apartment",
    slug: "shared-apartment",
    icon: "https://img.icons8.com/fluency/96/apartment.png",
  },
  {
    name: "Shared Room",
    slug: "shared-room",
    icon: "https://img.icons8.com/fluency/96/room.png",
  },
  {
    name: "Shop",
    slug: "shop",
    icon: "https://img.icons8.com/fluency/96/shop.png",
  },
  {
    name: "Showroom",
    slug: "showroom",
    icon: "https://img.icons8.com/fluency/96/showroom.png",
  },
  {
    name: "Single Room",
    slug: "single-room",
    icon: "https://img.icons8.com/fluency/96/room.png",
  },
  {
    name: "Staff Quarter",
    slug: "staff-quarter",
    icon: "https://img.icons8.com/fluency/96/staff-room.png",
  },
  {
    name: "Storage Unit",
    slug: "storage-unit",
    icon: "https://img.icons8.com/fluency/96/storage.png",
  },
  {
    name: "Studio Apartment",
    slug: "studio-apartment",
    icon: "https://img.icons8.com/fluency/96/studio-apartment.png",
  },
  {
    name: "Townhouse",
    slug: "townhouse",
    icon: "https://img.icons8.com/fluency/96/townhouse.png",
  },
  {
    name: "Triplex",
    slug: "triplex",
    icon: "https://img.icons8.com/fluency/96/home.png",
  },
  {
    name: "Vacation Home",
    slug: "vacation-home",
    icon: "https://img.icons8.com/fluency/96/holiday-home.png",
  },
  {
    name: "Villa",
    slug: "villa",
    icon: "https://img.icons8.com/fluency/96/villa.png",
  },
  {
    name: "Warehouse",
    slug: "warehouse",
    icon: "https://img.icons8.com/fluency/96/warehouse.png",
  },
];

const amenities = [
  {
    name: "24/7 Security",
    slug: "24-7-security",
    icon: "https://img.icons8.com/fluency/96/security-guard.png",
  },
  {
    name: "Air Conditioning",
    slug: "air-conditioning",
    icon: "https://img.icons8.com/fluency/96/air-conditioner.png",
  },
  {
    name: "Airport Shuttle",
    slug: "airport-shuttle",
    icon: "https://img.icons8.com/fluency/96/airport.png",
  },
  {
    name: "Balcony",
    slug: "balcony",
    icon: "https://img.icons8.com/fluency/96/balcony.png",
  },
  {
    name: "Barbecue Area",
    slug: "barbecue-area",
    icon: "https://img.icons8.com/fluency/96/bbq.png",
  },
  {
    name: "Basketball Court",
    slug: "basketball-court",
    icon: "https://img.icons8.com/fluency/96/basketball.png",
  },
  {
    name: "Bicycle Parking",
    slug: "bicycle-parking",
    icon: "https://img.icons8.com/fluency/96/bicycle.png",
  },
  {
    name: "Breakfast Included",
    slug: "breakfast-included",
    icon: "https://img.icons8.com/fluency/96/breakfast.png",
  },
  {
    name: "Business Center",
    slug: "business-center",
    icon: "https://img.icons8.com/fluency/96/business.png",
  },
  {
    name: "Cable TV",
    slug: "cable-tv",
    icon: "https://img.icons8.com/fluency/96/tv.png",
  },
  {
    name: "Car Wash Area",
    slug: "car-wash-area",
    icon: "https://img.icons8.com/fluency/96/car-wash.png",
  },
  {
    name: "Central Heating",
    slug: "central-heating",
    icon: "https://img.icons8.com/fluency/96/heating.png",
  },
  {
    name: "Children's Playground",
    slug: "children's-playground",
    icon: "https://img.icons8.com/fluency/96/playground.png",
  },
  {
    name: "Cinema Room",
    slug: "cinema-room",
    icon: "https://img.icons8.com/fluency/96/movie-projector.png",
  },
  {
    name: "Cleaning Service",
    slug: "cleaning-service",
    icon: "https://img.icons8.com/fluency/96/cleaning-service.png",
  },
  {
    name: "Clubhouse",
    slug: "clubhouse",
    icon: "https://img.icons8.com/fluency/96/community.png",
  },
  {
    name: "Coffee Machine",
    slug: "coffee-machine",
    icon: "https://img.icons8.com/fluency/96/coffee-maker.png",
  },
  {
    name: "Community Hall",
    slug: "community-hall",
    icon: "https://img.icons8.com/fluency/96/hall.png",
  },
  {
    name: "Concierge",
    slug: "concierge",
    icon: "https://img.icons8.com/fluency/96/customer-support.png",
  },
  {
    name: "Conference Room",
    slug: "conference-room",
    icon: "https://img.icons8.com/fluency/96/conference.png",
  },
  {
    name: "Coworking Space",
    slug: "coworking-space",
    icon: "https://img.icons8.com/fluency/96/workspace.png",
  },
  {
    name: "Dishwasher",
    slug: "dishwasher",
    icon: "https://img.icons8.com/fluency/96/dishwasher.png",
  },
  {
    name: "Doorman",
    slug: "doorman",
    icon: "https://img.icons8.com/fluency/96/doorman.png",
  },
  {
    name: "Drinking Water",
    slug: "drinking-water",
    icon: "https://img.icons8.com/fluency/96/water.png",
  },
  {
    name: "Dryer",
    slug: "dryer",
    icon: "https://img.icons8.com/fluency/96/dryer.png",
  },
  {
    name: "Electric Vehicle Charging Station",
    slug: "electric-vehicle-charging-station",
    icon: "https://img.icons8.com/fluency/96/electric-car.png",
  },
  {
    name: "Elevator",
    slug: "elevator",
    icon: "https://img.icons8.com/fluency/96/elevator.png",
  },
  {
    name: "Emergency Exit",
    slug: "emergency-exit",
    icon: "https://img.icons8.com/fluency/96/exit.png",
  },
  {
    name: "Fire Alarm",
    slug: "fire-alarm",
    icon: "https://img.icons8.com/fluency/96/fire-alarm.png",
  },
  {
    name: "Fire Extinguisher",
    slug: "fire-extinguisher",
    icon: "https://img.icons8.com/fluency/96/fire-extinguisher.png",
  },
  {
    name: "First Aid Kit",
    slug: "first-aid-kit",
    icon: "https://img.icons8.com/fluency/96/first-aid-kit.png",
  },
  {
    name: "Fitness Center",
    slug: "fitness-center",
    icon: "https://img.icons8.com/fluency/96/gym.png",
  },
  {
    name: "Free Parking",
    slug: "free-parking",
    icon: "https://img.icons8.com/fluency/96/parking.png",
  },
  {
    name: "Free Wi-Fi",
    slug: "free-wifi",
    icon: "https://img.icons8.com/fluency/96/wifi.png",
  },
  {
    name: "Fully Equipped Kitchen",
    slug: "fully-equipped-kitchen",
    icon: "https://img.icons8.com/fluency/96/kitchen-room.png",
  },
  {
    name: "Furnished",
    slug: "furnished",
    icon: "https://img.icons8.com/fluency/96/sofa.png",
  },
  {
    name: "Garden",
    slug: "garden",
    icon: "https://img.icons8.com/fluency/96/garden.png",
  },
  {
    name: "Gas Supply",
    slug: "gas-supply",
    icon: "https://img.icons8.com/fluency/96/gas.png",
  },
  {
    name: "Generator Backup",
    slug: "generator-backup",
    icon: "https://img.icons8.com/fluency/96/generator.png",
  },
  {
    name: "Grocery Store Nearby",
    slug: "grocery-store-nearby",
    icon: "https://img.icons8.com/fluency/96/grocery-store.png",
  },
  {
    name: "Gym",
    slug: "gym",
    icon: "https://img.icons8.com/fluency/96/dumbbell.png",
  },
  {
    name: "High-Speed Internet",
    slug: "high-speed-internet",
    icon: "https://img.icons8.com/fluency/96/internet.png",
  },
  {
    name: "Hot Tub",
    slug: "hot-tub",
    icon: "https://img.icons8.com/fluency/96/hot-tub.png",
  },
  {
    name: "Housekeeping",
    slug: "housekeeping",
    icon: "https://img.icons8.com/fluency/96/cleaning.png",
  },
  {
    name: "Intercom",
    slug: "intercom",
    icon: "https://img.icons8.com/fluency/96/intercom.png",
  },
  {
    name: "Jacuzzi",
    slug: "jacuzzi",
    icon: "https://img.icons8.com/fluency/96/jacuzzi.png",
  },
  {
    name: "Jogging Track",
    slug: "jogging-track",
    icon: "https://img.icons8.com/fluency/96/running.png",
  },
  {
    name: "Laundry Room",
    slug: "laundry-room",
    icon: "https://img.icons8.com/fluency/96/laundry.png",
  },
  {
    name: "Library",
    slug: "library",
    icon: "https://img.icons8.com/fluency/96/library.png",
  },
  {
    name: "Lobby",
    slug: "lobby",
    icon: "https://img.icons8.com/fluency/96/lobby.png",
  },
  {
    name: "Maintenance Service",
    slug: "maintenance-service",
    icon: "https://img.icons8.com/fluency/96/maintenance.png",
  },
  {
    name: "Meeting Room",
    slug: "meeting-room",
    icon: "https://img.icons8.com/fluency/96/meeting-room.png",
  },
  {
    name: "Microwave",
    slug: "microwave",
    icon: "https://img.icons8.com/fluency/96/microwave.png",
  },
  {
    name: "Mini Bar",
    slug: "mini-bar",
    icon: "https://img.icons8.com/fluency/96/bar.png",
  },
  {
    name: "Mosque Nearby",
    slug: "mosque-nearby",
    icon: "https://img.icons8.com/fluency/96/mosque.png",
  },
  {
    name: "Outdoor Seating",
    slug: "outdoor-seating",
    icon: "https://img.icons8.com/fluency/96/outdoor-seat.png",
  },
  {
    name: "Oven",
    slug: "oven",
    icon: "https://img.icons8.com/fluency/96/oven.png",
  },
  {
    name: "Package Receiving",
    slug: "package-receiving",
    icon: "https://img.icons8.com/fluency/96/package.png",
  },
  {
    name: "Parking",
    slug: "parking",
    icon: "https://img.icons8.com/fluency/96/parking.png",
  },
  {
    name: "Pet Area",
    slug: "pet-area",
    icon: "https://img.icons8.com/fluency/96/dog.png",
  },
  {
    name: "Prayer Room",
    slug: "prayer-room",
    icon: "https://img.icons8.com/fluency/96/prayer.png",
  },
  {
    name: "Private Garden",
    slug: "private-garden",
    icon: "https://img.icons8.com/fluency/96/garden.png",
  },
  {
    name: "Reception",
    slug: "reception",
    icon: "https://img.icons8.com/fluency/96/reception.png",
  },
  {
    name: "Refrigerator",
    slug: "refrigerator",
    icon: "https://img.icons8.com/fluency/96/fridge.png",
  },
  {
    name: "Rooftop Access",
    slug: "rooftop-access",
    icon: "https://img.icons8.com/fluency/96/roof.png",
  },
  {
    name: "Room Service",
    slug: "room-service",
    icon: "https://img.icons8.com/fluency/96/service.png",
  },
  {
    name: "Sauna",
    slug: "sauna",
    icon: "https://img.icons8.com/fluency/96/sauna.png",
  },
  {
    name: "Security Cameras",
    slug: "security-cameras",
    icon: "https://img.icons8.com/fluency/96/cctv.png",
  },
  {
    name: "Security Guard",
    slug: "security-guard",
    icon: "https://img.icons8.com/fluency/96/security-guard.png",
  },
  {
    name: "Shared Kitchen",
    slug: "shared-kitchen",
    icon: "https://img.icons8.com/fluency/96/kitchen.png",
  },
  {
    name: "Smoke Detector",
    slug: "smoke-detector",
    icon: "https://img.icons8.com/fluency/96/smoke-detector.png",
  },
  {
    name: "Solar Power",
    slug: "solar-power",
    icon: "https://img.icons8.com/fluency/96/solar-panel.png",
  },
  {
    name: "Sports Court",
    slug: "sports-court",
    icon: "https://img.icons8.com/fluency/96/sports.png",
  },
  {
    name: "Storage Room",
    slug: "storage-room",
    icon: "https://img.icons8.com/fluency/96/storage.png",
  },
  {
    name: "Study Room",
    slug: "study-room",
    icon: "https://img.icons8.com/fluency/96/study.png",
  },
  {
    name: "Swimming Pool",
    slug: "swimming-pool",
    icon: "https://img.icons8.com/fluency/96/swimming-pool.png",
  },
  {
    name: "Tennis Court",
    slug: "tennis-court",
    icon: "https://img.icons8.com/fluency/96/tennis.png",
  },
  {
    name: "Terrace",
    slug: "terrace",
    icon: "https://img.icons8.com/fluency/96/terrace.png",
  },
  {
    name: "Visitor Parking",
    slug: "visitor-parking",
    icon: "https://img.icons8.com/fluency/96/car-parking.png",
  },
  {
    name: "Walk-In Closet",
    slug: "walk-in-closet",
    icon: "https://img.icons8.com/fluency/96/wardrobe.png",
  },
  {
    name: "Washing Machine",
    slug: "washing-machine",
    icon: "https://img.icons8.com/fluency/96/washing-machine.png",
  },
  {
    name: "Water Purifier",
    slug: "water-purifier",
    icon: "https://img.icons8.com/fluency/96/water-filter.png",
  },
  {
    name: "Water Supply",
    slug: "water-supply",
    icon: "https://img.icons8.com/fluency/96/water.png",
  },
  {
    name: "Wheelchair Accessible",
    slug: "wheelchair-accessible",
    icon: "https://img.icons8.com/fluency/96/wheelchair.png",
  },
  {
    name: "Workspace",
    slug: "workspace",
    icon: "https://img.icons8.com/fluency/96/workspace.png",
  },
];

const features = [
  {
    name: "New Construction",
    slug: "new-construction",
    icon: "https://img.icons8.com/fluency/96/new.png",
  },
  {
    name: "Fully Furnished",
    slug: "fully-furnished",
    icon: "https://img.icons8.com/fluency/96/sofa.png",
  },
  {
    name: "Semi Furnished",
    slug: "semi-furnished",
    icon: "https://img.icons8.com/fluency/96/furniture.png",
  },
  {
    name: "Unfurnished",
    slug: "unfurnished",
    icon: "https://img.icons8.com/fluency/96/empty-box.png",
  },
  {
    name: "Studio Apartment",
    slug: "studio-apartment",
    icon: "https://img.icons8.com/fluency/96/apartment.png",
  },
  {
    name: "Single Story",
    slug: "single-story",
    icon: "https://img.icons8.com/fluency/96/one-story-house.png",
  },
  {
    name: "Multi Story",
    slug: "multi-story",
    icon: "https://img.icons8.com/fluency/96/skyscrapers.png",
  },
  {
    name: "Corner Unit",
    slug: "corner-unit",
    icon: "https://img.icons8.com/fluency/96/corner.png",
  },
  {
    name: "High Floor",
    slug: "high-floor",
    icon: "https://img.icons8.com/fluency/96/elevator-up.png",
  },
  {
    name: "Low Floor",
    slug: "low-floor",
    icon: "https://img.icons8.com/fluency/96/elevator-down.png",
  },
  {
    name: "Open Floor Plan",
    slug: "open-floor-plan",
    icon: "https://img.icons8.com/fluency/96/floor-plan.png",
  },
  {
    name: "Sea View",
    slug: "sea-view",
    icon: "https://img.icons8.com/fluency/96/sea.png",
  },
  {
    name: "Mountain View",
    slug: "mountain-view",
    icon: "https://img.icons8.com/fluency/96/mountain.png",
  },
  {
    name: "City View",
    slug: "city-view",
    icon: "https://img.icons8.com/fluency/96/city.png",
  },
  {
    name: "Garden View",
    slug: "garden-view",
    icon: "https://img.icons8.com/fluency/96/garden.png",
  },
  {
    name: "River View",
    slug: "river-view",
    icon: "https://img.icons8.com/fluency/96/river.png",
  },
  {
    name: "Private Entrance",
    slug: "private-entrance",
    icon: "https://img.icons8.com/fluency/96/door.png",
  },
  {
    name: "Private Balcony",
    slug: "private-balcony",
    icon: "https://img.icons8.com/fluency/96/balcony.png",
  },
  {
    name: "Walk-In Closet",
    slug: "walk-in-closet",
    icon: "https://img.icons8.com/fluency/96/wardrobe.png",
  },
  {
    name: "High Ceiling",
    slug: "high-ceiling",
    icon: "https://img.icons8.com/fluency/96/ceiling.png",
  },
  {
    name: "Soundproof Room",
    slug: "soundproof-room",
    icon: "https://img.icons8.com/fluency/96/soundproof.png",
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    icon: "https://img.icons8.com/fluency/96/smart-home.png",
  },
  {
    name: "Smart Lock",
    slug: "smart-lock",
    icon: "https://img.icons8.com/fluency/96/smart-lock.png",
  },
  {
    name: "Pet Friendly",
    slug: "pet-friendly",
    icon: "https://img.icons8.com/fluency/96/dog.png",
  },
  {
    name: "Family Friendly",
    slug: "family-friendly",
    icon: "https://img.icons8.com/fluency/96/family.png",
  },
  {
    name: "Luxury Property",
    slug: "luxury-property",
    icon: "https://img.icons8.com/fluency/96/luxury.png",
  },
  {
    name: "Eco Friendly",
    slug: "eco-friendly",
    icon: "https://img.icons8.com/fluency/96/eco-friendly.png",
  },
  {
    name: "Solar Equipped",
    slug: "solar-equipped",
    icon: "https://img.icons8.com/fluency/96/solar-panel.png",
  },
  {
    name: "Corner Property",
    slug: "corner-property",
    icon: "https://img.icons8.com/fluency/96/corner.png",
  },
  {
    name: "Renovated",
    slug: "renovated",
    icon: "https://img.icons8.com/fluency/96/renovation.png",
  },
];

const rules = [
  {
    name: "Advance Notice Required Before Move-Out",
    slug: "advance-notice-required-before-move-out",
    icon: "https://img.icons8.com/fluency/96/calendar.png",
  },
  {
    name: "Alcohol Allowed",
    slug: "alcohol-allowed",
    icon: "https://img.icons8.com/fluency/96/wine-glass.png",
  },
  {
    name: "Alcohol Prohibited",
    slug: "alcohol-prohibited",
    icon: "https://img.icons8.com/fluency/96/no-alcohol.png",
  },
  {
    name: "Background Check Required",
    slug: "background-check-required",
    icon: "https://img.icons8.com/fluency/96/security-checked.png",
  },
  {
    name: "Children Allowed",
    slug: "children-allowed",
    icon: "https://img.icons8.com/fluency/96/family.png",
  },
  {
    name: "Commercial Activities Prohibited",
    slug: "commercial-activities-prohibited",
    icon: "https://img.icons8.com/fluency/96/no-business.png",
  },
  {
    name: "Community Rules Must Be Followed",
    slug: "community-rules-must-be-followed",
    icon: "https://img.icons8.com/fluency/96/rules.png",
  },
  {
    name: "Early Lease Termination Fee Applies",
    slug: "early-lease-termination-fee-applies",
    icon: "https://img.icons8.com/fluency/96/money-bag.png",
  },
  {
    name: "Guest Registration Required",
    slug: "guest-registration-required",
    icon: "https://img.icons8.com/fluency/96/registration.png",
  },
  {
    name: "Illegal Activities Prohibited",
    slug: "illegal-activities-prohibited",
    icon: "https://img.icons8.com/fluency/96/no-entry.png",
  },
  {
    name: "Maintenance Access Required",
    slug: "maintenance-access-required",
    icon: "https://img.icons8.com/fluency/96/maintenance.png",
  },
  {
    name: "Maximum Occupancy Applies",
    slug: "maximum-occupancy-applies",
    icon: "https://img.icons8.com/fluency/96/group.png",
  },
  {
    name: "No Fireworks",
    slug: "no-fireworks",
    icon: "https://img.icons8.com/fluency/96/no-fireworks.png",
  },
  {
    name: "No Loud Music",
    slug: "no-loud-music",
    icon: "https://img.icons8.com/fluency/96/no-audio.png",
  },
  {
    name: "No Open Flames",
    slug: "no-open-flames",
    icon: "https://img.icons8.com/fluency/96/no-fire.png",
  },
  {
    name: "No Parties Or Events",
    slug: "no-parties-or-events",
    icon: "https://img.icons8.com/fluency/96/no-party.png",
  },
  {
    name: "No Pets",
    slug: "no-pets",
    icon: "https://img.icons8.com/fluency/96/no-dogs.png",
  },
  {
    name: "No Smoking",
    slug: "no-smoking",
    icon: "https://img.icons8.com/fluency/96/no-smoking.png",
  },
  {
    name: "No Subletting",
    slug: "no-subletting",
    icon: "https://img.icons8.com/fluency/96/no-contract.png",
  },
  {
    name: "No Unauthorized Modifications",
    slug: "no-unauthorized-modifications",
    icon: "https://img.icons8.com/fluency/96/edit-disabled.png",
  },
  {
    name: "Only Registered Occupants Allowed",
    slug: "only-registered-occupants-allowed",
    icon: "https://img.icons8.com/fluency/96/id-verified.png",
  },
  {
    name: "Overnight Guests Allowed",
    slug: "overnight-guests-allowed",
    icon: "https://img.icons8.com/fluency/96/guest-male.png",
  },
  {
    name: "Overnight Guests Not Allowed",
    slug: "overnight-guests-not-allowed",
    icon: "https://img.icons8.com/fluency/96/no-guests.png",
  },
  {
    name: "Parking Permit Required",
    slug: "parking-permit-required",
    icon: "https://img.icons8.com/fluency/96/parking.png",
  },
  {
    name: "Pets Allowed",
    slug: "pets-allowed",
    icon: "https://img.icons8.com/fluency/96/dog.png",
  },
  {
    name: "Pets Must Be Registered",
    slug: "pets-must-be-registered",
    icon: "https://img.icons8.com/fluency/96/pet-passport.png",
  },
  {
    name: "Quiet Hours Enforced",
    slug: "quiet-hours-enforced",
    icon: "https://img.icons8.com/fluency/96/silence.png",
  },
  {
    name: "Recycling Required",
    slug: "recycling-required",
    icon: "https://img.icons8.com/fluency/96/recycle.png",
  },
  {
    name: "Rent Due Monthly",
    slug: "rent-due-monthly",
    icon: "https://img.icons8.com/fluency/96/payment-history.png",
  },
  {
    name: "Renter's Insurance Required",
    slug: "renters-insurance-required",
    icon: "https://img.icons8.com/fluency/96/insurance.png",
  },
  {
    name: "Security Deposit Required",
    slug: "security-deposit-required",
    icon: "https://img.icons8.com/fluency/96/money-box.png",
  },
  {
    name: "Shoes Must Be Removed Indoors",
    slug: "shoes-must-be-removed-indoors",
    icon: "https://img.icons8.com/fluency/96/shoes.png",
  },
  {
    name: "Smoking Allowed",
    slug: "smoking-allowed",
    icon: "https://img.icons8.com/fluency/96/smoking.png",
  },
  {
    name: "Tenant Responsible For Minor Maintenance",
    slug: "tenant-responsible-for-minor-maintenance",
    icon: "https://img.icons8.com/fluency/96/tools.png",
  },
  {
    name: "Trash Disposal Guidelines Must Be Followed",
    slug: "trash-disposal-guidelines-must-be-followed",
    icon: "https://img.icons8.com/fluency/96/trash.png",
  },
  {
    name: "Utilities Included",
    slug: "utilities-included",
    icon: "https://img.icons8.com/fluency/96/electricity.png",
  },
  {
    name: "Utilities Paid By Tenant",
    slug: "utilities-paid-by-tenant",
    icon: "https://img.icons8.com/fluency/96/bill.png",
  },
  {
    name: "Visitor Parking Only In Designated Areas",
    slug: "visitor-parking-only-in-designated-areas",
    icon: "https://img.icons8.com/fluency/96/car-parking.png",
  },
  {
    name: "Visitors Allowed",
    slug: "visitors-allowed",
    icon: "https://img.icons8.com/fluency/96/visitors.png",
  },
  {
    name: "Visitors Restricted After Certain Hours",
    slug: "visitors-restricted-after-certain-hours",
    icon: "https://img.icons8.com/fluency/96/time-limit.png",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.propertyCategory.createMany({
    data: propertyCategories,
    skipDuplicates: true,
  });

  console.log("✅ Property categories seeded");

  await prisma.amenity.createMany({
    data: amenities,
    skipDuplicates: true,
  });

  console.log("✅ Amenities seeded");

  await prisma.feature.createMany({
    data: features,
    skipDuplicates: true,
  });

  console.log("✅ Features seeded");

  await prisma.rule.createMany({
    data: rules,
    skipDuplicates: true,
  });

  console.log("✅ Rules seeded");

  console.log("🎉 Database seeding completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
