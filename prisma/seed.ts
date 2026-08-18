import prisma from "../src/lib/prisma";

// const propertyCategories = [
//   {
//     name: "Apartment",
//     slug: "apartment",
//     icon: "https://img.icons8.com/fluency/96/apartment.png",
//   },
//   {
//     name: "Basement Apartment",
//     slug: "basement-apartment",
//     icon: "https://img.icons8.com/fluency/96/basement.png",
//   },
//   {
//     name: "Boarding House",
//     slug: "boarding-house",
//     icon: "https://img.icons8.com/fluency/96/hostel.png",
//   },
//   {
//     name: "Bungalow",
//     slug: "bungalow",
//     icon: "https://img.icons8.com/fluency/96/bungalow.png",
//   },
//   {
//     name: "Cabin",
//     slug: "cabin",
//     icon: "https://img.icons8.com/fluency/96/log-cabin.png",
//   },
//   {
//     name: "Castle",
//     slug: "castle",
//     icon: "https://img.icons8.com/fluency/96/castle.png",
//   },
//   {
//     name: "Chalet",
//     slug: "chalet",
//     icon: "https://img.icons8.com/fluency/96/chalet.png",
//   },
//   {
//     name: "Co-Living Space",
//     slug: "co-living-space",
//     icon: "https://img.icons8.com/fluency/96/living-room.png",
//   },
//   {
//     name: "Commercial Building",
//     slug: "commercial-building",
//     icon: "https://img.icons8.com/fluency/96/commercial.png",
//   },
//   {
//     name: "Commercial Plot",
//     slug: "commercial-plot",
//     icon: "https://img.icons8.com/fluency/96/land-sales.png",
//   },
//   {
//     name: "Commercial Space",
//     slug: "commercial-space",
//     icon: "https://img.icons8.com/fluency/96/business-building.png",
//   },
//   {
//     name: "Condominium",
//     slug: "condominium",
//     icon: "https://img.icons8.com/fluency/96/condominium.png",
//   },
//   {
//     name: "Container Home",
//     slug: "container-home",
//     icon: "https://img.icons8.com/fluency/96/container.png",
//   },
//   {
//     name: "Cottage",
//     slug: "cottage",
//     icon: "https://img.icons8.com/fluency/96/cottage.png",
//   },
//   {
//     name: "Detached House",
//     slug: "detached-house",
//     icon: "https://img.icons8.com/fluency/96/home.png",
//   },
//   {
//     name: "Dormitory",
//     slug: "dormitory",
//     icon: "https://img.icons8.com/fluency/96/dormitory.png",
//   },
//   {
//     name: "Duplex",
//     slug: "duplex",
//     icon: "https://img.icons8.com/fluency/96/duplex-house.png",
//   },
//   {
//     name: "Factory",
//     slug: "factory",
//     icon: "https://img.icons8.com/fluency/96/factory.png",
//   },
//   {
//     name: "Farm",
//     slug: "farm",
//     icon: "https://img.icons8.com/fluency/96/farm.png",
//   },
//   {
//     name: "Farmhouse",
//     slug: "farmhouse",
//     icon: "https://img.icons8.com/fluency/96/farm-house.png",
//   },
//   {
//     name: "Flat",
//     slug: "flat",
//     icon: "https://img.icons8.com/fluency/96/apartment.png",
//   },
//   {
//     name: "Garage",
//     slug: "garage",
//     icon: "https://img.icons8.com/fluency/96/garage.png",
//   },
//   {
//     name: "Guest House",
//     slug: "guest-house",
//     icon: "https://img.icons8.com/fluency/96/guest-house.png",
//   },
//   {
//     name: "Holiday Home",
//     slug: "holiday-home",
//     icon: "https://img.icons8.com/fluency/96/holiday-home.png",
//   },
//   {
//     name: "Hostel",
//     slug: "hostel",
//     icon: "https://img.icons8.com/fluency/96/hostel.png",
//   },
//   {
//     name: "Hotel Room",
//     slug: "hotel-room",
//     icon: "https://img.icons8.com/fluency/96/hotel-room.png",
//   },
//   {
//     name: "House",
//     slug: "house",
//     icon: "https://img.icons8.com/fluency/96/home.png",
//   },
//   {
//     name: "Industrial Building",
//     slug: "industrial-building",
//     icon: "https://img.icons8.com/fluency/96/factory.png",
//   },
//   {
//     name: "Industrial Space",
//     slug: "industrial-space",
//     icon: "https://img.icons8.com/fluency/96/warehouse.png",
//   },
//   {
//     name: "Land",
//     slug: "land",
//     icon: "https://img.icons8.com/fluency/96/land-sales.png",
//   },
//   {
//     name: "Loft",
//     slug: "loft",
//     icon: "https://img.icons8.com/fluency/96/loft.png",
//   },
//   {
//     name: "Mansion",
//     slug: "mansion",
//     icon: "https://img.icons8.com/fluency/96/mansion.png",
//   },
//   {
//     name: "Mobile Home",
//     slug: "mobile-home",
//     icon: "https://img.icons8.com/fluency/96/mobile-home.png",
//   },
//   {
//     name: "Office",
//     slug: "office",
//     icon: "https://img.icons8.com/fluency/96/office.png",
//   },
//   {
//     name: "Office Floor",
//     slug: "office-floor",
//     icon: "https://img.icons8.com/fluency/96/office-building.png",
//   },
//   {
//     name: "Parking Space",
//     slug: "parking-space",
//     icon: "https://img.icons8.com/fluency/96/parking.png",
//   },
//   {
//     name: "Penthouse",
//     slug: "penthouse",
//     icon: "https://img.icons8.com/fluency/96/penthouse.png",
//   },
//   {
//     name: "Private Room",
//     slug: "private-room",
//     icon: "https://img.icons8.com/fluency/96/room.png",
//   },
//   {
//     name: "Residential Plot",
//     slug: "residential-plot",
//     icon: "https://img.icons8.com/fluency/96/land-sales.png",
//   },
//   {
//     name: "Retail Shop",
//     slug: "retail-shop",
//     icon: "https://img.icons8.com/fluency/96/shop.png",
//   },
//   {
//     name: "Semi-Detached House",
//     slug: "semi-detached-house",
//     icon: "https://img.icons8.com/fluency/96/home.png",
//   },
//   {
//     name: "Serviced Apartment",
//     slug: "serviced-apartment",
//     icon: "https://img.icons8.com/fluency/96/apartment.png",
//   },
//   {
//     name: "Shared Apartment",
//     slug: "shared-apartment",
//     icon: "https://img.icons8.com/fluency/96/apartment.png",
//   },
//   {
//     name: "Shared Room",
//     slug: "shared-room",
//     icon: "https://img.icons8.com/fluency/96/room.png",
//   },
//   {
//     name: "Shop",
//     slug: "shop",
//     icon: "https://img.icons8.com/fluency/96/shop.png",
//   },
//   {
//     name: "Showroom",
//     slug: "showroom",
//     icon: "https://img.icons8.com/fluency/96/showroom.png",
//   },
//   {
//     name: "Single Room",
//     slug: "single-room",
//     icon: "https://img.icons8.com/fluency/96/room.png",
//   },
//   {
//     name: "Staff Quarter",
//     slug: "staff-quarter",
//     icon: "https://img.icons8.com/fluency/96/staff-room.png",
//   },
//   {
//     name: "Storage Unit",
//     slug: "storage-unit",
//     icon: "https://img.icons8.com/fluency/96/storage.png",
//   },
//   {
//     name: "Studio Apartment",
//     slug: "studio-apartment",
//     icon: "https://img.icons8.com/fluency/96/studio-apartment.png",
//   },
//   {
//     name: "Townhouse",
//     slug: "townhouse",
//     icon: "https://img.icons8.com/fluency/96/townhouse.png",
//   },
//   {
//     name: "Triplex",
//     slug: "triplex",
//     icon: "https://img.icons8.com/fluency/96/home.png",
//   },
//   {
//     name: "Vacation Home",
//     slug: "vacation-home",
//     icon: "https://img.icons8.com/fluency/96/holiday-home.png",
//   },
//   {
//     name: "Villa",
//     slug: "villa",
//     icon: "https://img.icons8.com/fluency/96/villa.png",
//   },
//   {
//     name: "Warehouse",
//     slug: "warehouse",
//     icon: "https://img.icons8.com/fluency/96/warehouse.png",
//   },
// ];

// const amenities = [
//   {
//     name: "24/7 Security",
//     slug: "24-7-security",
//     icon: "https://img.icons8.com/fluency/96/security-guard.png",
//   },
//   {
//     name: "Air Conditioning",
//     slug: "air-conditioning",
//     icon: "https://img.icons8.com/fluency/96/air-conditioner.png",
//   },
//   {
//     name: "Airport Shuttle",
//     slug: "airport-shuttle",
//     icon: "https://img.icons8.com/fluency/96/airport.png",
//   },
//   {
//     name: "Balcony",
//     slug: "balcony",
//     icon: "https://img.icons8.com/fluency/96/balcony.png",
//   },
//   {
//     name: "Barbecue Area",
//     slug: "barbecue-area",
//     icon: "https://img.icons8.com/fluency/96/bbq.png",
//   },
//   {
//     name: "Basketball Court",
//     slug: "basketball-court",
//     icon: "https://img.icons8.com/fluency/96/basketball.png",
//   },
//   {
//     name: "Bicycle Parking",
//     slug: "bicycle-parking",
//     icon: "https://img.icons8.com/fluency/96/bicycle.png",
//   },
//   {
//     name: "Breakfast Included",
//     slug: "breakfast-included",
//     icon: "https://img.icons8.com/fluency/96/breakfast.png",
//   },
//   {
//     name: "Business Center",
//     slug: "business-center",
//     icon: "https://img.icons8.com/fluency/96/business.png",
//   },
//   {
//     name: "Cable TV",
//     slug: "cable-tv",
//     icon: "https://img.icons8.com/fluency/96/tv.png",
//   },
//   {
//     name: "Car Wash Area",
//     slug: "car-wash-area",
//     icon: "https://img.icons8.com/fluency/96/car-wash.png",
//   },
//   {
//     name: "Central Heating",
//     slug: "central-heating",
//     icon: "https://img.icons8.com/fluency/96/heating.png",
//   },
//   {
//     name: "Children's Playground",
//     slug: "children's-playground",
//     icon: "https://img.icons8.com/fluency/96/playground.png",
//   },
//   {
//     name: "Cinema Room",
//     slug: "cinema-room",
//     icon: "https://img.icons8.com/fluency/96/movie-projector.png",
//   },
//   {
//     name: "Cleaning Service",
//     slug: "cleaning-service",
//     icon: "https://img.icons8.com/fluency/96/cleaning-service.png",
//   },
//   {
//     name: "Clubhouse",
//     slug: "clubhouse",
//     icon: "https://img.icons8.com/fluency/96/community.png",
//   },
//   {
//     name: "Coffee Machine",
//     slug: "coffee-machine",
//     icon: "https://img.icons8.com/fluency/96/coffee-maker.png",
//   },
//   {
//     name: "Community Hall",
//     slug: "community-hall",
//     icon: "https://img.icons8.com/fluency/96/hall.png",
//   },
//   {
//     name: "Concierge",
//     slug: "concierge",
//     icon: "https://img.icons8.com/fluency/96/customer-support.png",
//   },
//   {
//     name: "Conference Room",
//     slug: "conference-room",
//     icon: "https://img.icons8.com/fluency/96/conference.png",
//   },
//   {
//     name: "Coworking Space",
//     slug: "coworking-space",
//     icon: "https://img.icons8.com/fluency/96/workspace.png",
//   },
//   {
//     name: "Dishwasher",
//     slug: "dishwasher",
//     icon: "https://img.icons8.com/fluency/96/dishwasher.png",
//   },
//   {
//     name: "Doorman",
//     slug: "doorman",
//     icon: "https://img.icons8.com/fluency/96/doorman.png",
//   },
//   {
//     name: "Drinking Water",
//     slug: "drinking-water",
//     icon: "https://img.icons8.com/fluency/96/water.png",
//   },
//   {
//     name: "Dryer",
//     slug: "dryer",
//     icon: "https://img.icons8.com/fluency/96/dryer.png",
//   },
//   {
//     name: "Electric Vehicle Charging Station",
//     slug: "electric-vehicle-charging-station",
//     icon: "https://img.icons8.com/fluency/96/electric-car.png",
//   },
//   {
//     name: "Elevator",
//     slug: "elevator",
//     icon: "https://img.icons8.com/fluency/96/elevator.png",
//   },
//   {
//     name: "Emergency Exit",
//     slug: "emergency-exit",
//     icon: "https://img.icons8.com/fluency/96/exit.png",
//   },
//   {
//     name: "Fire Alarm",
//     slug: "fire-alarm",
//     icon: "https://img.icons8.com/fluency/96/fire-alarm.png",
//   },
//   {
//     name: "Fire Extinguisher",
//     slug: "fire-extinguisher",
//     icon: "https://img.icons8.com/fluency/96/fire-extinguisher.png",
//   },
//   {
//     name: "First Aid Kit",
//     slug: "first-aid-kit",
//     icon: "https://img.icons8.com/fluency/96/first-aid-kit.png",
//   },
//   {
//     name: "Fitness Center",
//     slug: "fitness-center",
//     icon: "https://img.icons8.com/fluency/96/gym.png",
//   },
//   {
//     name: "Free Parking",
//     slug: "free-parking",
//     icon: "https://img.icons8.com/fluency/96/parking.png",
//   },
//   {
//     name: "Free Wi-Fi",
//     slug: "free-wifi",
//     icon: "https://img.icons8.com/fluency/96/wifi.png",
//   },
//   {
//     name: "Fully Equipped Kitchen",
//     slug: "fully-equipped-kitchen",
//     icon: "https://img.icons8.com/fluency/96/kitchen-room.png",
//   },
//   {
//     name: "Furnished",
//     slug: "furnished",
//     icon: "https://img.icons8.com/fluency/96/sofa.png",
//   },
//   {
//     name: "Garden",
//     slug: "garden",
//     icon: "https://img.icons8.com/fluency/96/garden.png",
//   },
//   {
//     name: "Gas Supply",
//     slug: "gas-supply",
//     icon: "https://img.icons8.com/fluency/96/gas.png",
//   },
//   {
//     name: "Generator Backup",
//     slug: "generator-backup",
//     icon: "https://img.icons8.com/fluency/96/generator.png",
//   },
//   {
//     name: "Grocery Store Nearby",
//     slug: "grocery-store-nearby",
//     icon: "https://img.icons8.com/fluency/96/grocery-store.png",
//   },
//   {
//     name: "Gym",
//     slug: "gym",
//     icon: "https://img.icons8.com/fluency/96/dumbbell.png",
//   },
//   {
//     name: "High-Speed Internet",
//     slug: "high-speed-internet",
//     icon: "https://img.icons8.com/fluency/96/internet.png",
//   },
//   {
//     name: "Hot Tub",
//     slug: "hot-tub",
//     icon: "https://img.icons8.com/fluency/96/hot-tub.png",
//   },
//   {
//     name: "Housekeeping",
//     slug: "housekeeping",
//     icon: "https://img.icons8.com/fluency/96/cleaning.png",
//   },
//   {
//     name: "Intercom",
//     slug: "intercom",
//     icon: "https://img.icons8.com/fluency/96/intercom.png",
//   },
//   {
//     name: "Jacuzzi",
//     slug: "jacuzzi",
//     icon: "https://img.icons8.com/fluency/96/jacuzzi.png",
//   },
//   {
//     name: "Jogging Track",
//     slug: "jogging-track",
//     icon: "https://img.icons8.com/fluency/96/running.png",
//   },
//   {
//     name: "Laundry Room",
//     slug: "laundry-room",
//     icon: "https://img.icons8.com/fluency/96/laundry.png",
//   },
//   {
//     name: "Library",
//     slug: "library",
//     icon: "https://img.icons8.com/fluency/96/library.png",
//   },
//   {
//     name: "Lobby",
//     slug: "lobby",
//     icon: "https://img.icons8.com/fluency/96/lobby.png",
//   },
//   {
//     name: "Maintenance Service",
//     slug: "maintenance-service",
//     icon: "https://img.icons8.com/fluency/96/maintenance.png",
//   },
//   {
//     name: "Meeting Room",
//     slug: "meeting-room",
//     icon: "https://img.icons8.com/fluency/96/meeting-room.png",
//   },
//   {
//     name: "Microwave",
//     slug: "microwave",
//     icon: "https://img.icons8.com/fluency/96/microwave.png",
//   },
//   {
//     name: "Mini Bar",
//     slug: "mini-bar",
//     icon: "https://img.icons8.com/fluency/96/bar.png",
//   },
//   {
//     name: "Mosque Nearby",
//     slug: "mosque-nearby",
//     icon: "https://img.icons8.com/fluency/96/mosque.png",
//   },
//   {
//     name: "Outdoor Seating",
//     slug: "outdoor-seating",
//     icon: "https://img.icons8.com/fluency/96/outdoor-seat.png",
//   },
//   {
//     name: "Oven",
//     slug: "oven",
//     icon: "https://img.icons8.com/fluency/96/oven.png",
//   },
//   {
//     name: "Package Receiving",
//     slug: "package-receiving",
//     icon: "https://img.icons8.com/fluency/96/package.png",
//   },
//   {
//     name: "Parking",
//     slug: "parking",
//     icon: "https://img.icons8.com/fluency/96/parking.png",
//   },
//   {
//     name: "Pet Area",
//     slug: "pet-area",
//     icon: "https://img.icons8.com/fluency/96/dog.png",
//   },
//   {
//     name: "Prayer Room",
//     slug: "prayer-room",
//     icon: "https://img.icons8.com/fluency/96/prayer.png",
//   },
//   {
//     name: "Private Garden",
//     slug: "private-garden",
//     icon: "https://img.icons8.com/fluency/96/garden.png",
//   },
//   {
//     name: "Reception",
//     slug: "reception",
//     icon: "https://img.icons8.com/fluency/96/reception.png",
//   },
//   {
//     name: "Refrigerator",
//     slug: "refrigerator",
//     icon: "https://img.icons8.com/fluency/96/fridge.png",
//   },
//   {
//     name: "Rooftop Access",
//     slug: "rooftop-access",
//     icon: "https://img.icons8.com/fluency/96/roof.png",
//   },
//   {
//     name: "Room Service",
//     slug: "room-service",
//     icon: "https://img.icons8.com/fluency/96/service.png",
//   },
//   {
//     name: "Sauna",
//     slug: "sauna",
//     icon: "https://img.icons8.com/fluency/96/sauna.png",
//   },
//   {
//     name: "Security Cameras",
//     slug: "security-cameras",
//     icon: "https://img.icons8.com/fluency/96/cctv.png",
//   },
//   {
//     name: "Security Guard",
//     slug: "security-guard",
//     icon: "https://img.icons8.com/fluency/96/security-guard.png",
//   },
//   {
//     name: "Shared Kitchen",
//     slug: "shared-kitchen",
//     icon: "https://img.icons8.com/fluency/96/kitchen.png",
//   },
//   {
//     name: "Smoke Detector",
//     slug: "smoke-detector",
//     icon: "https://img.icons8.com/fluency/96/smoke-detector.png",
//   },
//   {
//     name: "Solar Power",
//     slug: "solar-power",
//     icon: "https://img.icons8.com/fluency/96/solar-panel.png",
//   },
//   {
//     name: "Sports Court",
//     slug: "sports-court",
//     icon: "https://img.icons8.com/fluency/96/sports.png",
//   },
//   {
//     name: "Storage Room",
//     slug: "storage-room",
//     icon: "https://img.icons8.com/fluency/96/storage.png",
//   },
//   {
//     name: "Study Room",
//     slug: "study-room",
//     icon: "https://img.icons8.com/fluency/96/study.png",
//   },
//   {
//     name: "Swimming Pool",
//     slug: "swimming-pool",
//     icon: "https://img.icons8.com/fluency/96/swimming-pool.png",
//   },
//   {
//     name: "Tennis Court",
//     slug: "tennis-court",
//     icon: "https://img.icons8.com/fluency/96/tennis.png",
//   },
//   {
//     name: "Terrace",
//     slug: "terrace",
//     icon: "https://img.icons8.com/fluency/96/terrace.png",
//   },
//   {
//     name: "Visitor Parking",
//     slug: "visitor-parking",
//     icon: "https://img.icons8.com/fluency/96/car-parking.png",
//   },
//   {
//     name: "Walk-In Closet",
//     slug: "walk-in-closet",
//     icon: "https://img.icons8.com/fluency/96/wardrobe.png",
//   },
//   {
//     name: "Washing Machine",
//     slug: "washing-machine",
//     icon: "https://img.icons8.com/fluency/96/washing-machine.png",
//   },
//   {
//     name: "Water Purifier",
//     slug: "water-purifier",
//     icon: "https://img.icons8.com/fluency/96/water-filter.png",
//   },
//   {
//     name: "Water Supply",
//     slug: "water-supply",
//     icon: "https://img.icons8.com/fluency/96/water.png",
//   },
//   {
//     name: "Wheelchair Accessible",
//     slug: "wheelchair-accessible",
//     icon: "https://img.icons8.com/fluency/96/wheelchair.png",
//   },
//   {
//     name: "Workspace",
//     slug: "workspace",
//     icon: "https://img.icons8.com/fluency/96/workspace.png",
//   },
// ];

// const features = [
//   {
//     name: "New Construction",
//     slug: "new-construction",
//     icon: "https://img.icons8.com/fluency/96/new.png",
//   },
//   {
//     name: "Fully Furnished",
//     slug: "fully-furnished",
//     icon: "https://img.icons8.com/fluency/96/sofa.png",
//   },
//   {
//     name: "Semi Furnished",
//     slug: "semi-furnished",
//     icon: "https://img.icons8.com/fluency/96/furniture.png",
//   },
//   {
//     name: "Unfurnished",
//     slug: "unfurnished",
//     icon: "https://img.icons8.com/fluency/96/empty-box.png",
//   },
//   {
//     name: "Studio Apartment",
//     slug: "studio-apartment",
//     icon: "https://img.icons8.com/fluency/96/apartment.png",
//   },
//   {
//     name: "Single Story",
//     slug: "single-story",
//     icon: "https://img.icons8.com/fluency/96/one-story-house.png",
//   },
//   {
//     name: "Multi Story",
//     slug: "multi-story",
//     icon: "https://img.icons8.com/fluency/96/skyscrapers.png",
//   },
//   {
//     name: "Corner Unit",
//     slug: "corner-unit",
//     icon: "https://img.icons8.com/fluency/96/corner.png",
//   },
//   {
//     name: "High Floor",
//     slug: "high-floor",
//     icon: "https://img.icons8.com/fluency/96/elevator-up.png",
//   },
//   {
//     name: "Low Floor",
//     slug: "low-floor",
//     icon: "https://img.icons8.com/fluency/96/elevator-down.png",
//   },
//   {
//     name: "Open Floor Plan",
//     slug: "open-floor-plan",
//     icon: "https://img.icons8.com/fluency/96/floor-plan.png",
//   },
//   {
//     name: "Sea View",
//     slug: "sea-view",
//     icon: "https://img.icons8.com/fluency/96/sea.png",
//   },
//   {
//     name: "Mountain View",
//     slug: "mountain-view",
//     icon: "https://img.icons8.com/fluency/96/mountain.png",
//   },
//   {
//     name: "City View",
//     slug: "city-view",
//     icon: "https://img.icons8.com/fluency/96/city.png",
//   },
//   {
//     name: "Garden View",
//     slug: "garden-view",
//     icon: "https://img.icons8.com/fluency/96/garden.png",
//   },
//   {
//     name: "River View",
//     slug: "river-view",
//     icon: "https://img.icons8.com/fluency/96/river.png",
//   },
//   {
//     name: "Private Entrance",
//     slug: "private-entrance",
//     icon: "https://img.icons8.com/fluency/96/door.png",
//   },
//   {
//     name: "Private Balcony",
//     slug: "private-balcony",
//     icon: "https://img.icons8.com/fluency/96/balcony.png",
//   },
//   {
//     name: "Walk-In Closet",
//     slug: "walk-in-closet",
//     icon: "https://img.icons8.com/fluency/96/wardrobe.png",
//   },
//   {
//     name: "High Ceiling",
//     slug: "high-ceiling",
//     icon: "https://img.icons8.com/fluency/96/ceiling.png",
//   },
//   {
//     name: "Soundproof Room",
//     slug: "soundproof-room",
//     icon: "https://img.icons8.com/fluency/96/soundproof.png",
//   },
//   {
//     name: "Smart Home",
//     slug: "smart-home",
//     icon: "https://img.icons8.com/fluency/96/smart-home.png",
//   },
//   {
//     name: "Smart Lock",
//     slug: "smart-lock",
//     icon: "https://img.icons8.com/fluency/96/smart-lock.png",
//   },
//   {
//     name: "Pet Friendly",
//     slug: "pet-friendly",
//     icon: "https://img.icons8.com/fluency/96/dog.png",
//   },
//   {
//     name: "Family Friendly",
//     slug: "family-friendly",
//     icon: "https://img.icons8.com/fluency/96/family.png",
//   },
//   {
//     name: "Luxury Property",
//     slug: "luxury-property",
//     icon: "https://img.icons8.com/fluency/96/luxury.png",
//   },
//   {
//     name: "Eco Friendly",
//     slug: "eco-friendly",
//     icon: "https://img.icons8.com/fluency/96/eco-friendly.png",
//   },
//   {
//     name: "Solar Equipped",
//     slug: "solar-equipped",
//     icon: "https://img.icons8.com/fluency/96/solar-panel.png",
//   },
//   {
//     name: "Corner Property",
//     slug: "corner-property",
//     icon: "https://img.icons8.com/fluency/96/corner.png",
//   },
//   {
//     name: "Renovated",
//     slug: "renovated",
//     icon: "https://img.icons8.com/fluency/96/renovation.png",
//   },
// ];

// const rules = [
//   {
//     name: "Advance Notice Required Before Move-Out",
//     slug: "advance-notice-required-before-move-out",
//     icon: "https://img.icons8.com/fluency/96/calendar.png",
//   },
//   {
//     name: "Alcohol Allowed",
//     slug: "alcohol-allowed",
//     icon: "https://img.icons8.com/fluency/96/wine-glass.png",
//   },
//   {
//     name: "Alcohol Prohibited",
//     slug: "alcohol-prohibited",
//     icon: "https://img.icons8.com/fluency/96/no-alcohol.png",
//   },
//   {
//     name: "Background Check Required",
//     slug: "background-check-required",
//     icon: "https://img.icons8.com/fluency/96/security-checked.png",
//   },
//   {
//     name: "Children Allowed",
//     slug: "children-allowed",
//     icon: "https://img.icons8.com/fluency/96/family.png",
//   },
//   {
//     name: "Commercial Activities Prohibited",
//     slug: "commercial-activities-prohibited",
//     icon: "https://img.icons8.com/fluency/96/no-business.png",
//   },
//   {
//     name: "Community Rules Must Be Followed",
//     slug: "community-rules-must-be-followed",
//     icon: "https://img.icons8.com/fluency/96/rules.png",
//   },
//   {
//     name: "Early Lease Termination Fee Applies",
//     slug: "early-lease-termination-fee-applies",
//     icon: "https://img.icons8.com/fluency/96/money-bag.png",
//   },
//   {
//     name: "Guest Registration Required",
//     slug: "guest-registration-required",
//     icon: "https://img.icons8.com/fluency/96/registration.png",
//   },
//   {
//     name: "Illegal Activities Prohibited",
//     slug: "illegal-activities-prohibited",
//     icon: "https://img.icons8.com/fluency/96/no-entry.png",
//   },
//   {
//     name: "Maintenance Access Required",
//     slug: "maintenance-access-required",
//     icon: "https://img.icons8.com/fluency/96/maintenance.png",
//   },
//   {
//     name: "Maximum Occupancy Applies",
//     slug: "maximum-occupancy-applies",
//     icon: "https://img.icons8.com/fluency/96/group.png",
//   },
//   {
//     name: "No Fireworks",
//     slug: "no-fireworks",
//     icon: "https://img.icons8.com/fluency/96/no-fireworks.png",
//   },
//   {
//     name: "No Loud Music",
//     slug: "no-loud-music",
//     icon: "https://img.icons8.com/fluency/96/no-audio.png",
//   },
//   {
//     name: "No Open Flames",
//     slug: "no-open-flames",
//     icon: "https://img.icons8.com/fluency/96/no-fire.png",
//   },
//   {
//     name: "No Parties Or Events",
//     slug: "no-parties-or-events",
//     icon: "https://img.icons8.com/fluency/96/no-party.png",
//   },
//   {
//     name: "No Pets",
//     slug: "no-pets",
//     icon: "https://img.icons8.com/fluency/96/no-dogs.png",
//   },
//   {
//     name: "No Smoking",
//     slug: "no-smoking",
//     icon: "https://img.icons8.com/fluency/96/no-smoking.png",
//   },
//   {
//     name: "No Subletting",
//     slug: "no-subletting",
//     icon: "https://img.icons8.com/fluency/96/no-contract.png",
//   },
//   {
//     name: "No Unauthorized Modifications",
//     slug: "no-unauthorized-modifications",
//     icon: "https://img.icons8.com/fluency/96/edit-disabled.png",
//   },
//   {
//     name: "Only Registered Occupants Allowed",
//     slug: "only-registered-occupants-allowed",
//     icon: "https://img.icons8.com/fluency/96/id-verified.png",
//   },
//   {
//     name: "Overnight Guests Allowed",
//     slug: "overnight-guests-allowed",
//     icon: "https://img.icons8.com/fluency/96/guest-male.png",
//   },
//   {
//     name: "Overnight Guests Not Allowed",
//     slug: "overnight-guests-not-allowed",
//     icon: "https://img.icons8.com/fluency/96/no-guests.png",
//   },
//   {
//     name: "Parking Permit Required",
//     slug: "parking-permit-required",
//     icon: "https://img.icons8.com/fluency/96/parking.png",
//   },
//   {
//     name: "Pets Allowed",
//     slug: "pets-allowed",
//     icon: "https://img.icons8.com/fluency/96/dog.png",
//   },
//   {
//     name: "Pets Must Be Registered",
//     slug: "pets-must-be-registered",
//     icon: "https://img.icons8.com/fluency/96/pet-passport.png",
//   },
//   {
//     name: "Quiet Hours Enforced",
//     slug: "quiet-hours-enforced",
//     icon: "https://img.icons8.com/fluency/96/silence.png",
//   },
//   {
//     name: "Recycling Required",
//     slug: "recycling-required",
//     icon: "https://img.icons8.com/fluency/96/recycle.png",
//   },
//   {
//     name: "Rent Due Monthly",
//     slug: "rent-due-monthly",
//     icon: "https://img.icons8.com/fluency/96/payment-history.png",
//   },
//   {
//     name: "Renter's Insurance Required",
//     slug: "renters-insurance-required",
//     icon: "https://img.icons8.com/fluency/96/insurance.png",
//   },
//   {
//     name: "Security Deposit Required",
//     slug: "security-deposit-required",
//     icon: "https://img.icons8.com/fluency/96/money-box.png",
//   },
//   {
//     name: "Shoes Must Be Removed Indoors",
//     slug: "shoes-must-be-removed-indoors",
//     icon: "https://img.icons8.com/fluency/96/shoes.png",
//   },
//   {
//     name: "Smoking Allowed",
//     slug: "smoking-allowed",
//     icon: "https://img.icons8.com/fluency/96/smoking.png",
//   },
//   {
//     name: "Tenant Responsible For Minor Maintenance",
//     slug: "tenant-responsible-for-minor-maintenance",
//     icon: "https://img.icons8.com/fluency/96/tools.png",
//   },
//   {
//     name: "Trash Disposal Guidelines Must Be Followed",
//     slug: "trash-disposal-guidelines-must-be-followed",
//     icon: "https://img.icons8.com/fluency/96/trash.png",
//   },
//   {
//     name: "Utilities Included",
//     slug: "utilities-included",
//     icon: "https://img.icons8.com/fluency/96/electricity.png",
//   },
//   {
//     name: "Utilities Paid By Tenant",
//     slug: "utilities-paid-by-tenant",
//     icon: "https://img.icons8.com/fluency/96/bill.png",
//   },
//   {
//     name: "Visitor Parking Only In Designated Areas",
//     slug: "visitor-parking-only-in-designated-areas",
//     icon: "https://img.icons8.com/fluency/96/car-parking.png",
//   },
//   {
//     name: "Visitors Allowed",
//     slug: "visitors-allowed",
//     icon: "https://img.icons8.com/fluency/96/visitors.png",
//   },
//   {
//     name: "Visitors Restricted After Certain Hours",
//     slug: "visitors-restricted-after-certain-hours",
//     icon: "https://img.icons8.com/fluency/96/time-limit.png",
//   },
// ];

// async function main() {
//   console.log("🌱 Seeding database...");

//   await prisma.propertyCategory.createMany({
//     data: propertyCategories,
//     skipDuplicates: true,
//   });

//   console.log("✅ Property categories seeded");

//   await prisma.amenity.createMany({
//     data: amenities,
//     skipDuplicates: true,
//   });

//   console.log("✅ Amenities seeded");

//   await prisma.feature.createMany({
//     data: features,
//     skipDuplicates: true,
//   });

//   console.log("✅ Features seeded");

//   await prisma.rule.createMany({
//     data: rules,
//     skipDuplicates: true,
//   });

//   console.log("✅ Rules seeded");

//   console.log("🎉 Database seeding completed");
// }

// main()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import {
  Prisma,
  AvailabilityStatus,
  PropertyStatus,
  LocationType,
} from "../generated/prisma/client";

const LANDLORD_ID = "dfa85d1f-e40d-48e6-a14b-d5c11698355f";

/**
 * ============================================================
 * PROPERTY SEED DATA
 * ============================================================
 *
 * rent:
 *   USD per day
 *
 * securityDeposit:
 *   USD
 *
 * area:
 *   square feet
 *
 * All categories, amenities, features and rules are loaded
 * from the existing database.
 */

const propertySeeds = [
  {
    title: "Bright Two Bedroom Apartment in Dhanmondi",
    description:
      "A bright and comfortable two bedroom apartment with modern interiors, excellent ventilation, spacious living areas, and convenient access to restaurants, shopping centers, schools, and public transportation.",
    rent: 29,
    securityDeposit: 580,
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    availableFrom: "2026-09-01",
    city: "Dhaka",
    village: "Dhanmondi",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1209",
    latitude: "23.7465",
    longitude: "90.3760",
    addressLine: "House 15, Road 7, Dhanmondi, Dhaka",
  },

  {
    title: "Luxury Executive Apartment in Gulshan",
    description:
      "A premium executive apartment featuring elegant interiors, spacious bedrooms, modern appliances, excellent security, and convenient access to offices, restaurants, shopping centers, and major roads.",
    rent: 65,
    securityDeposit: 1300,
    bedrooms: 3,
    bathrooms: 3,
    area: 1900,
    availableFrom: "2026-09-05",
    city: "Dhaka",
    village: "Gulshan",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1212",
    latitude: "23.7806",
    longitude: "90.4070",
    addressLine: "House 22, Road 11, Gulshan, Dhaka",
  },

  {
    title: "Affordable Single Bedroom Flat in Mirpur",
    description:
      "An affordable and clean one bedroom apartment suitable for students or professionals looking for a comfortable and convenient place to stay near markets, restaurants, schools, and transportation.",
    rent: 16,
    securityDeposit: 320,
    bedrooms: 1,
    bathrooms: 1,
    area: 680,
    availableFrom: "2026-08-25",
    city: "Dhaka",
    village: "Mirpur",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1216",
    latitude: "23.8223",
    longitude: "90.3654",
    addressLine: "House 8, Block C, Mirpur, Dhaka",
  },

  {
    title: "Spacious Family Apartment in Uttara",
    description:
      "A spacious four bedroom family apartment with multiple bathrooms, a large living room, excellent natural lighting, comfortable bedrooms, and a peaceful residential environment.",
    rent: 43,
    securityDeposit: 860,
    bedrooms: 4,
    bathrooms: 3,
    area: 2300,
    availableFrom: "2026-09-10",
    city: "Dhaka",
    village: "Uttara",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1230",
    latitude: "23.8759",
    longitude: "90.3795",
    addressLine: "House 31, Road 4, Sector 7, Uttara, Dhaka",
  },

  {
    title: "Modern Studio Apartment in Banani",
    description:
      "A stylish studio apartment with modern furniture, a compact kitchen, excellent security, comfortable living space, and easy access to offices, restaurants, shopping centers, and public transportation.",
    rent: 25,
    securityDeposit: 500,
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    availableFrom: "2026-08-22",
    city: "Dhaka",
    village: "Banani",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1213",
    latitude: "23.7936",
    longitude: "90.4043",
    addressLine: "House 12, Road 9, Banani, Dhaka",
  },

  {
    title: "Premium Family Flat in Bashundhara",
    description:
      "A premium three bedroom apartment with modern facilities, spacious bedrooms, secure parking, excellent security, comfortable living areas, and a peaceful residential environment.",
    rent: 48,
    securityDeposit: 960,
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    availableFrom: "2026-09-15",
    city: "Dhaka",
    village: "Bashundhara",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1229",
    latitude: "23.8141",
    longitude: "90.4256",
    addressLine: "Block D, Road 6, Bashundhara R/A, Dhaka",
  },

  {
    title: "Quiet Two Bedroom Home in Mohammadpur",
    description:
      "A peaceful two bedroom home with good ventilation, comfortable rooms, convenient access to schools, markets, restaurants, parks, and public transportation.",
    rent: 22,
    securityDeposit: 440,
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    availableFrom: "2026-08-28",
    city: "Dhaka",
    village: "Mohammadpur",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1207",
    latitude: "23.7667",
    longitude: "90.3583",
    addressLine: "House 19, Road 3, Mohammadpur, Dhaka",
  },

  {
    title: "Contemporary Apartment in Badda",
    description:
      "A contemporary two bedroom apartment offering comfortable living spaces, modern utilities, excellent ventilation, secure parking, and easy access to major roads and commercial areas.",
    rent: 26,
    securityDeposit: 520,
    bedrooms: 2,
    bathrooms: 2,
    area: 1180,
    availableFrom: "2026-09-01",
    city: "Dhaka",
    village: "Badda",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1212",
    latitude: "23.7808",
    longitude: "90.4312",
    addressLine: "House 45, Pragati Avenue, Badda, Dhaka",
  },

  {
    title: "Elegant Luxury Residence in Baridhara",
    description:
      "A luxurious four bedroom residence featuring premium finishes, large living spaces, modern bathrooms, excellent security, spacious bedrooms, and beautiful city views.",
    rent: 78,
    securityDeposit: 1560,
    bedrooms: 4,
    bathrooms: 4,
    area: 2900,
    availableFrom: "2026-10-01",
    city: "Dhaka",
    village: "Baridhara",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1212",
    latitude: "23.7925",
    longitude: "90.4208",
    addressLine: "House 17, Road 2, Baridhara, Dhaka",
  },

  {
    title: "Budget One Bedroom Flat in Jatrabari",
    description:
      "A budget friendly one bedroom flat with essential facilities and convenient access to public transportation, local markets, schools, shops, and everyday services.",
    rent: 13,
    securityDeposit: 260,
    bedrooms: 1,
    bathrooms: 1,
    area: 620,
    availableFrom: "2026-08-25",
    city: "Dhaka",
    village: "Jatrabari",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1204",
    latitude: "23.7104",
    longitude: "90.4256",
    addressLine: "House 9, Shahid Faruk Road, Jatrabari, Dhaka",
  },

  {
    title: "Comfortable Two Bedroom Apartment in Panchlaish",
    description:
      "A comfortable two bedroom apartment in Panchlaish with convenient access to hospitals, restaurants, universities, shopping areas, and public transportation.",
    rent: 24,
    securityDeposit: 480,
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    availableFrom: "2026-09-03",
    city: "Chattogram",
    village: "Panchlaish",
    district: "Chattogram",
    division: "Chattogram",
    postalCode: "4203",
    latitude: "22.3475",
    longitude: "91.8123",
    addressLine: "House 24, O.R. Nizam Road, Panchlaish, Chattogram",
  },

  {
    title: "Hill View Luxury Apartment in Khulshi",
    description:
      "A premium apartment in Khulshi offering spacious rooms, beautiful surroundings, modern facilities, excellent security, comfortable living areas, and attractive views.",
    rent: 42,
    securityDeposit: 840,
    bedrooms: 3,
    bathrooms: 3,
    area: 1700,
    availableFrom: "2026-09-20",
    city: "Chattogram",
    village: "Khulshi",
    district: "Chattogram",
    division: "Chattogram",
    postalCode: "4225",
    latitude: "22.3569",
    longitude: "91.7832",
    addressLine: "House 18, Zakir Hossain Road, Khulshi, Chattogram",
  },

  {
    title: "Affordable Family Home in Sonadanga",
    description:
      "A practical three bedroom family home in a peaceful residential neighborhood with nearby schools, markets, parks, hospitals, and essential services.",
    rent: 18,
    securityDeposit: 360,
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    availableFrom: "2026-08-30",
    city: "Khulna",
    village: "Sonadanga",
    district: "Khulna",
    division: "Khulna",
    postalCode: "9100",
    latitude: "22.8456",
    longitude: "89.5403",
    addressLine: "House 11, Sonadanga Residential Area, Khulna",
  },

  {
    title: "Modern Student Apartment in Rajshahi",
    description:
      "A clean and affordable apartment ideal for students and young professionals, located close to universities, restaurants, shops, markets, and city facilities.",
    rent: 14,
    securityDeposit: 280,
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    availableFrom: "2026-08-20",
    city: "Rajshahi",
    village: "Boalia",
    district: "Rajshahi",
    division: "Rajshahi",
    postalCode: "6000",
    latitude: "24.3745",
    longitude: "88.6042",
    addressLine: "House 32, Shaheb Bazar Road, Boalia, Rajshahi",
  },

  {
    title: "Cozy Two Bedroom Apartment in Sylhet",
    description:
      "A cozy two bedroom apartment in a convenient Sylhet neighborhood with comfortable living spaces, good ventilation, parking facilities, and essential amenities.",
    rent: 20,
    securityDeposit: 400,
    bedrooms: 2,
    bathrooms: 2,
    area: 1000,
    availableFrom: "2026-09-01",
    city: "Sylhet",
    village: "Ambarkhana",
    district: "Sylhet",
    division: "Sylhet",
    postalCode: "3100",
    latitude: "24.9036",
    longitude: "91.8736",
    addressLine: "House 16, Airport Road, Ambarkhana, Sylhet",
  },

  {
    title: "Premium City Apartment in Zindabazar",
    description:
      "A modern three bedroom apartment located near shops, restaurants, offices, educational institutions, and major transportation facilities in Sylhet.",
    rent: 30,
    securityDeposit: 600,
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    availableFrom: "2026-09-12",
    city: "Sylhet",
    village: "Zindabazar",
    district: "Sylhet",
    division: "Sylhet",
    postalCode: "3100",
    latitude: "24.8949",
    longitude: "91.8687",
    addressLine: "House 8, Zindabazar Main Road, Sylhet",
  },

  {
    title: "Peaceful Family Home in Barishal",
    description:
      "A peaceful family residence with three bedrooms, comfortable living spaces, a private entrance, nearby schools, local markets, and essential community services.",
    rent: 17,
    securityDeposit: 340,
    bedrooms: 3,
    bathrooms: 2,
    area: 1350,
    availableFrom: "2026-09-05",
    city: "Barishal",
    village: "Nathullabad",
    district: "Barishal",
    division: "Barishal",
    postalCode: "8200",
    latitude: "22.7010",
    longitude: "90.3535",
    addressLine: "House 11, Nathullabad Residential Area, Barishal",
  },

  {
    title: "Modern Apartment Near Coxs Bazar Beach",
    description:
      "A comfortable modern apartment near Coxs Bazar beach with spacious rooms, convenient facilities, and easy access to restaurants, shops, tourist attractions, and the sea.",
    rent: 55,
    securityDeposit: 1100,
    bedrooms: 2,
    bathrooms: 2,
    area: 1150,
    availableFrom: "2026-09-01",
    city: "Cox's Bazar",
    village: "Kolatoli",
    district: "Cox's Bazar",
    division: "Chattogram",
    postalCode: "4700",
    latitude: "21.4272",
    longitude: "92.0058",
    addressLine: "Marine Drive Road, Kolatoli, Cox's Bazar",
  },

  {
    title: "Sea View Premium Residence in Coxs Bazar",
    description:
      "A premium residence offering beautiful sea views, spacious bedrooms, modern facilities, comfortable living areas, and quick access to the beach and tourist attractions.",
    rent: 85,
    securityDeposit: 1700,
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    availableFrom: "2026-10-05",
    city: "Cox's Bazar",
    village: "Kolatoli",
    district: "Cox's Bazar",
    division: "Chattogram",
    postalCode: "4700",
    latitude: "21.4187",
    longitude: "92.0061",
    addressLine: "Sea Beach Road, Kolatoli, Cox's Bazar",
  },

  {
    title: "Family Apartment in Wari Dhaka",
    description:
      "A comfortable family apartment in an established Dhaka neighborhood with nearby schools, markets, restaurants, hospitals, and convenient transportation options.",
    rent: 23,
    securityDeposit: 460,
    bedrooms: 2,
    bathrooms: 2,
    area: 1080,
    availableFrom: "2026-09-02",
    city: "Dhaka",
    village: "Wari",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1203",
    latitude: "23.7196",
    longitude: "90.4132",
    addressLine: "Rankin Street, Wari, Dhaka",
  },

  {
    title: "Large Four Bedroom Residence in Lalmatia",
    description:
      "A large family residence with four bedrooms, spacious living and dining areas, multiple bathrooms, excellent ventilation, and convenient access to schools and shopping areas.",
    rent: 51,
    securityDeposit: 1020,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    availableFrom: "2026-09-18",
    city: "Dhaka",
    village: "Lalmatia",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1207",
    latitude: "23.7556",
    longitude: "90.3655",
    addressLine: "Block B, Lalmatia, Dhaka",
  },

  {
    title: "Affordable Studio Near Farmgate",
    description:
      "A compact and affordable studio apartment ideal for students or working professionals with convenient access to offices, universities, restaurants, and public transportation.",
    rent: 19,
    securityDeposit: 380,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    availableFrom: "2026-08-21",
    city: "Dhaka",
    village: "Farmgate",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1215",
    latitude: "23.7578",
    longitude: "90.3897",
    addressLine: "Farmgate Main Road, Dhaka",
  },

  {
    title: "Executive Three Bedroom Home in Niketon",
    description:
      "An elegant three bedroom executive home with spacious rooms, modern finishes, secure parking, excellent security, and convenient access to Gulshan and Banani.",
    rent: 58,
    securityDeposit: 1160,
    bedrooms: 3,
    bathrooms: 3,
    area: 1750,
    availableFrom: "2026-09-25",
    city: "Dhaka",
    village: "Niketon",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1212",
    latitude: "23.7697",
    longitude: "90.4060",
    addressLine: "Road 4, Niketon, Dhaka",
  },

  {
    title: "Peaceful Two Bedroom Flat in Malibagh",
    description:
      "A peaceful two bedroom flat with comfortable interiors, natural lighting, good ventilation, parking availability, and convenient access to markets and transportation.",
    rent: 21,
    securityDeposit: 420,
    bedrooms: 2,
    bathrooms: 2,
    area: 1000,
    availableFrom: "2026-08-29",
    city: "Dhaka",
    village: "Malibagh",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1217",
    latitude: "23.7479",
    longitude: "90.4157",
    addressLine: "Malibagh Main Road, Dhaka",
  },

  {
    title: "Modern Family Apartment in Kallyanpur",
    description:
      "A modern family apartment with spacious bedrooms, comfortable bathrooms, good natural light, secure parking, and convenient access to schools, shops, and transportation.",
    rent: 20,
    securityDeposit: 400,
    bedrooms: 3,
    bathrooms: 2,
    area: 1300,
    availableFrom: "2026-09-07",
    city: "Dhaka",
    village: "Kallyanpur",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1207",
    latitude: "23.7762",
    longitude: "90.3598",
    addressLine: "Kallyanpur Main Road, Dhaka",
  },

  {
    title: "Luxury Penthouse in Gulshan Avenue",
    description:
      "An exceptional luxury penthouse with spacious interiors, premium finishes, large bedrooms, modern smart-home facilities, beautiful city views, and excellent security.",
    rent: 120,
    securityDeposit: 2400,
    bedrooms: 4,
    bathrooms: 5,
    area: 3600,
    availableFrom: "2026-10-10",
    city: "Dhaka",
    village: "Gulshan",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1212",
    latitude: "23.7825",
    longitude: "90.4088",
    addressLine: "Gulshan Avenue, Gulshan, Dhaka",
  },

  {
    title: "Comfortable Family Apartment in Rajshahi",
    description:
      "A comfortable family apartment in Rajshahi with spacious bedrooms, good ventilation, convenient parking, and easy access to schools, markets, parks, and city facilities.",
    rent: 16,
    securityDeposit: 320,
    bedrooms: 3,
    bathrooms: 2,
    area: 1350,
    availableFrom: "2026-09-01",
    city: "Rajshahi",
    village: "Kazla",
    district: "Rajshahi",
    division: "Rajshahi",
    postalCode: "6204",
    latitude: "24.3675",
    longitude: "88.6355",
    addressLine: "Kazla Residential Area, Rajshahi",
  },

  {
    title: "Modern Three Bedroom Apartment in Bogura",
    description:
      "A modern three bedroom apartment with comfortable living spaces, good natural light, secure parking, and convenient access to schools, hospitals, restaurants, and markets.",
    rent: 15,
    securityDeposit: 300,
    bedrooms: 3,
    bathrooms: 2,
    area: 1280,
    availableFrom: "2026-08-27",
    city: "Bogura",
    village: "Satmatha",
    district: "Bogura",
    division: "Rajshahi",
    postalCode: "5800",
    latitude: "24.8465",
    longitude: "89.3770",
    addressLine: "Satmatha Main Road, Bogura",
  },

  {
    title: "Premium Apartment in Mymensingh City",
    description:
      "A premium three bedroom apartment offering comfortable interiors, modern facilities, excellent ventilation, secure parking, and convenient access to educational institutions and city services.",
    rent: 18,
    securityDeposit: 360,
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    availableFrom: "2026-09-08",
    city: "Mymensingh",
    village: "Town Hall",
    district: "Mymensingh",
    division: "Mymensingh",
    postalCode: "2200",
    latitude: "24.7471",
    longitude: "90.4203",
    addressLine: "Town Hall Area, Mymensingh",
  },

  {
    title: "Spacious Four Bedroom Home in Savar",
    description:
      "A spacious four bedroom family home in Savar with a peaceful environment, large living spaces, private entrance, parking facilities, and nearby schools and markets.",
    rent: 24,
    securityDeposit: 480,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    availableFrom: "2026-09-15",
    city: "Savar",
    village: "Savar",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1340",
    latitude: "23.8583",
    longitude: "90.2660",
    addressLine: "Savar Main Road, Savar",
  },

  {
    title: "Modern One Bedroom Apartment in Uttara",
    description:
      "A modern one bedroom apartment in Uttara suitable for professionals or couples with comfortable interiors, good ventilation, parking, security, and convenient transportation.",
    rent: 23,
    securityDeposit: 460,
    bedrooms: 1,
    bathrooms: 1,
    area: 700,
    availableFrom: "2026-08-24",
    city: "Dhaka",
    village: "Uttara",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1230",
    latitude: "23.8680",
    longitude: "90.3910",
    addressLine: "Sector 10, Uttara, Dhaka",
  },

  {
    title: "Garden View Family Residence in Bashundhara",
    description:
      "A spacious family residence with comfortable bedrooms, garden views, private outdoor space, secure parking, excellent security, and a peaceful residential atmosphere.",
    rent: 54,
    securityDeposit: 1080,
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    availableFrom: "2026-09-22",
    city: "Dhaka",
    village: "Bashundhara",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1229",
    latitude: "23.8190",
    longitude: "90.4250",
    addressLine: "Block F, Bashundhara Residential Area, Dhaka",
  },

  {
    title: "Affordable Two Bedroom Apartment in Cumilla",
    description:
      "An affordable two bedroom apartment in a convenient residential area with nearby schools, markets, restaurants, hospitals, and public transportation.",
    rent: 14,
    securityDeposit: 280,
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    availableFrom: "2026-08-26",
    city: "Cumilla",
    village: "Kandirpar",
    district: "Cumilla",
    division: "Chattogram",
    postalCode: "3500",
    latitude: "23.4607",
    longitude: "91.1809",
    addressLine: "Kandirpar Main Road, Cumilla",
  },

  {
    title: "Peaceful Three Bedroom Residence in Rangpur",
    description:
      "A peaceful three bedroom residence with comfortable living spaces, private entrance, garden surroundings, parking facilities, and convenient access to schools and markets.",
    rent: 13,
    securityDeposit: 260,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    availableFrom: "2026-09-04",
    city: "Rangpur",
    village: "Modern",
    district: "Rangpur",
    division: "Rangpur",
    postalCode: "5400",
    latitude: "25.7439",
    longitude: "89.2752",
    addressLine: "Modern Residential Area, Rangpur",
  },
];

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getReferenceData() {
  const [categories, amenities, features, rules] = await Promise.all([
    prisma.propertyCategory.findMany({
      orderBy: {
        categoryNo: "asc",
      },
    }),

    prisma.amenity.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.feature.findMany({
      orderBy: {
        featureNo: "asc",
      },
    }),

    prisma.rule.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (categories.length === 0) {
    throw new Error(
      "No property categories found. Seed PropertyCategory first.",
    );
  }

  if (amenities.length === 0) {
    throw new Error("No amenities found. Seed Amenity first.");
  }

  if (features.length === 0) {
    throw new Error("No features found. Seed Feature first.");
  }

  if (rules.length === 0) {
    throw new Error("No rules found. Seed Rule first.");
  }

  return {
    categories,
    amenities,
    features,
    rules,
  };
}

/**
 * Take different existing records for each property.
 *
 * This means the seed does NOT care what UUIDs your
 * categories/amenities/rules currently have.
 */
function getItems<T>(items: T[], start: number, count: number) {
  const result: T[] = [];

  for (let i = 0; i < count; i++) {
    result.push(items[(start + i) % items.length]);
  }

  return result;
}

/**
 * ============================================================
 * SEED PROPERTIES
 * ============================================================
 */

async function seedProperties() {
  console.log("🌱 Starting property seed...\n");

  /**
   * Verify landlord.
   */
  const landlord = await prisma.users.findUnique({
    where: {
      id: LANDLORD_ID,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!landlord) {
    throw new Error(`Landlord ${LANDLORD_ID} was not found in the database.`);
  }

  console.log(`👤 Landlord: ${landlord.email ?? LANDLORD_ID}`);
  console.log(`   Role: ${landlord.role}`);

  const { categories, amenities, features, rules } = await getReferenceData();

  console.log(`📂 Categories: ${categories.length}`);
  console.log(`🛋️ Amenities: ${amenities.length}`);
  console.log(`✨ Features: ${features.length}`);
  console.log(`📜 Rules: ${rules.length}\n`);

  let createdCount = 0;
  let skippedCount = 0;

  for (let index = 0; index < propertySeeds.length; index++) {
    const seed = propertySeeds[index];

    const slug = slugify(seed.title);

    /**
     * --------------------------------------------------------
     * Skip existing property
     * --------------------------------------------------------
     */

    const existingProperty = await prisma.property.findUnique({
      where: {
        slug,
      },
    });

    if (existingProperty) {
      console.log(`⏭️  Skipping: ${seed.title}`);
      skippedCount++;
      continue;
    }

    /**
     * --------------------------------------------------------
     * Pick existing reference records
     * --------------------------------------------------------
     */

    const category = categories[index % categories.length];

    const selectedAmenities = getItems(
      amenities,
      index,
      Math.min(3, amenities.length),
    );

    const selectedFeatures = getItems(
      features,
      index * 2,
      Math.min(4, features.length),
    );

    const selectedRules = getItems(rules, index, Math.min(2, rules.length));

    /**
     * --------------------------------------------------------
     * Create everything in one transaction
     * --------------------------------------------------------
     */

    await prisma.$transaction(async (tx) => {
      /**
       * 1. Create property
       */
      const property = await tx.property.create({
        data: {
          title: seed.title,
          description: seed.description,
          slug,

          rent: new Prisma.Decimal(seed.rent.toFixed(2)),

          securityDeposit: new Prisma.Decimal(seed.securityDeposit.toFixed(2)),

          bedrooms: seed.bedrooms,
          bathrooms: seed.bathrooms,

          area: new Prisma.Decimal(seed.area.toFixed(2)),

          availableFrom: new Date(seed.availableFrom),

          averageRating: new Prisma.Decimal("0"),
          reviewCount: 0,
          totalRating: 0,

          landlord: {
            connect: {
              id: LANDLORD_ID,
            },
          },

          category: {
            connect: {
              id: category.id,
            },
          },
        },
      });

      /**
       * 2. Create PROPERTY location
       */
      const location = await tx.location.create({
        data: {
          type: LocationType.PROPERTY,

          country: "Bangladesh",
          division: seed.division,
          district: seed.district,
          city: seed.city,
          village: seed.village,
          postalCode: seed.postalCode,

          latitude: seed.latitude,
          longitude: seed.longitude,

          addressLine: seed.addressLine,

          propertyId: property.id,
        },
      });

      /**
       * 3. Connect location to property
       */
      await tx.property.update({
        where: {
          id: property.id,
        },

        data: {
          locationId: location.id,
        },
      });

      /**
       * 4. Property Amenities
       */
      await tx.propertyAmenities.createMany({
        data: selectedAmenities.map((amenity) => ({
          propertyId: property.id,
          amenityId: amenity.id,
        })),
        skipDuplicates: true,
      });

      /**
       * 5. Property Features
       */
      await tx.propertyFeatures.createMany({
        data: selectedFeatures.map((feature) => ({
          propertyId: property.id,
          featureId: feature.id,
        })),
        skipDuplicates: true,
      });

      /**
       * 6. Property Rules
       */
      await tx.propertyRules.createMany({
        data: selectedRules.map((rule) => ({
          propertyId: property.id,
          ruleId: rule.id,
        })),
        skipDuplicates: true,
      });
    });

    createdCount++;

    console.log(`✅ ${createdCount}/${propertySeeds.length} ${seed.title}`);
  }

  console.log("\n====================================");
  console.log("🏠 PROPERTY SEED COMPLETE");
  console.log("====================================");
  console.log(`Created : ${createdCount}`);
  console.log(`Skipped : ${skippedCount}`);
  console.log(`Total   : ${propertySeeds.length}`);
  console.log("====================================\n");
}

/**
 * ============================================================
 * MAIN
 * ============================================================
 */

async function main() {
  try {
    await seedProperties();
  } catch (error) {
    console.error("\n❌ Property seed failed:\n");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
