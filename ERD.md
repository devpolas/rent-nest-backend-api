# Prisma Markdown

```mermaid
erDiagram
"account_session" {
  String id PK
  String userId FK
  String refreshTokenHash UK
  String browser "nullable"
  String operatingSystem "nullable"
  String deviceType "nullable"
  String ipAddress "nullable"
  String userAgent "nullable"
  Boolean isRevoked
  DateTime revokedAt "nullable"
  DateTime expiresAt
  DateTime lastUsedAt
  DateTime createdAt
  DateTime updatedAt
}
"amenities" {
  String id PK
  Int amenityNo
  String(100) name UK
  String(120) slug UK
  String icon "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"auth_accounts" {
  String id PK
  String userId FK
  AuthProvider provider
  String providerAccountId "nullable"
  String accessTokenHash "nullable"
  String refreshTokenHash "nullable"
  DateTime tokenExpiresAt "nullable"
  String emailVerificationToken UK "nullable"
  DateTime emailVerificationExpires "nullable"
  String passwordResetToken UK "nullable"
  DateTime passwordResetExpires "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"features" {
  String id PK
  Int featureNo
  String(100) name UK
  String(120) slug UK
  String icon "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"locations" {
  String id PK
  String latitude "nullable"
  String longitude "nullable"
  LocationType type
  String country
  String division
  String district
  String city
  String village
  String postalCode
  String addressLine "nullable"
  String profileId FK "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"payments" {
  String id PK
  Decimal(10) amount
  String(20) currency
  String(20) provider
  String transactionId UK
  DateTime expireIn
  PaymentStatus status
  String propertyId
  String tenantId FK
  String landlordId FK
  DateTime createdAt
  DateTime updatedAt
}
"profiles" {
  String id PK
  String profileImage "nullable"
  String bio "nullable"
  DateTime birthdate "nullable"
  String userId FK,UK
  DateTime createdAt
  DateTime updatedAt
}
"properties" {
  String id PK
  String title
  String description
  String slug UK
  Decimal(10) rent
  Decimal(10) securityDeposit
  Int bedrooms
  Int bathrooms
  Decimal(10) area
  DateTime availableFrom "nullable"
  AvailabilityStatus availability
  PropertyStatus status
  String locationId FK,UK "nullable"
  String landlordId FK
  String categoryId FK
  DateTime createdAt
  DateTime updatedAt
}
"property_amenities" {
  String id PK
  String propertyId FK
  String amenityId FK
  DateTime createdAt
  DateTime updatedAt
}
"property_categories" {
  String id PK
  Int categoryNo
  String(100) name UK
  String(120) slug UK
  String icon "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"property_features" {
  String id PK
  String propertyId FK
  String featureId FK
  DateTime createdAt
  DateTime updatedAt
}
"property_images" {
  String id PK
  String propertyId FK
  String url
  Boolean isThumbnail
  DateTime createdAt
  DateTime updatedAt
}
"property_rules" {
  String id PK
  String propertyId FK
  String ruleId FK
  DateTime createdAt
  DateTime updatedAt
}
"rental_requests" {
  String id PK
  String tenantId FK
  String propertyId FK
  String landlordId FK
  String message
  DateTime moveInDate
  Int leaseDays
  RentalRequestStatus status
  DateTime createdAt
  DateTime updatedAt
}
"reviews" {
  String id PK
  String tenantId FK
  String propertyId FK
  Int rating
  String comment
  DateTime createdAt
  DateTime updatedAt
}
"rules" {
  String id PK
  Int ruleNo
  String(255) name UK
  String(300) slug UK
  String icon "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"social_profile" {
  String id PK
  SocialPlatform platform
  String url
  String profileId FK
  DateTime createdAt
  DateTime updatedAt
}
"users" {
  String id PK
  String(255) name
  String(255) email UK
  String(20) phone "nullable"
  String avatar "nullable"
  String password "nullable"
  UserRole role
  UserStatus status
  Boolean emailVerified
  DateTime createdAt
  DateTime updatedAt
}
"account_session" }o--|| "users" : user
"auth_accounts" }o--|| "users" : user
"locations" }o--o| "profiles" : profile
"payments" }o--|| "users" : tenant
"payments" }o--|| "users" : landlord
"profiles" |o--|| "users" : user
"properties" |o--o| "locations" : location
"properties" }o--|| "users" : landlord
"properties" }o--|| "property_categories" : category
"property_amenities" }o--|| "properties" : property
"property_amenities" }o--|| "amenities" : amenity
"property_features" }o--|| "properties" : property
"property_features" }o--|| "features" : feature
"property_images" }o--|| "properties" : property
"property_rules" }o--|| "properties" : property
"property_rules" }o--|| "rules" : rule
"rental_requests" }o--|| "properties" : property
"rental_requests" }o--|| "users" : tenant
"rental_requests" }o--|| "users" : landlord
"reviews" }o--|| "users" : tenant
"reviews" }o--|| "properties" : property
"social_profile" }o--|| "profiles" : profile
```

### `account_session`

Properties as follows:

- `id`:
- `userId`:
- `refreshTokenHash`:
- `browser`:
- `operatingSystem`:
- `deviceType`:
- `ipAddress`:
- `userAgent`:
- `isRevoked`:
- `revokedAt`:
- `expiresAt`:
- `lastUsedAt`:
- `createdAt`:
- `updatedAt`:

### `amenities`

Properties as follows:

- `id`:
- `amenityNo`:
- `name`:
- `slug`:
- `icon`:
- `createdAt`:
- `updatedAt`:

### `auth_accounts`

Properties as follows:

- `id`:
- `userId`:
- `provider`:
- `providerAccountId`:
- `accessTokenHash`:
- `refreshTokenHash`:
- `tokenExpiresAt`:
- `emailVerificationToken`:
- `emailVerificationExpires`:
- `passwordResetToken`:
- `passwordResetExpires`:
- `createdAt`:
- `updatedAt`:

### `features`

Properties as follows:

- `id`:
- `featureNo`:
- `name`:
- `slug`:
- `icon`:
- `createdAt`:
- `updatedAt`:

### `locations`

Properties as follows:

- `id`:
- `latitude`:
- `longitude`:
- `type`:
- `country`:
- `division`:
- `district`:
- `city`:
- `village`:
- `postalCode`:
- `addressLine`:
- `profileId`:
- `createdAt`:
- `updatedAt`:

### `payments`

Properties as follows:

- `id`:
- `amount`:
- `currency`:
- `provider`:
- `transactionId`:
- `expireIn`:
- `status`:
- `propertyId`:
- `tenantId`:
- `landlordId`:
- `createdAt`:
- `updatedAt`:

### `profiles`

Properties as follows:

- `id`:
- `profileImage`:
- `bio`:
- `birthdate`:
- `userId`:
- `createdAt`:
- `updatedAt`:

### `properties`

Properties as follows:

- `id`:
- `title`:
- `description`:
- `slug`:
- `rent`:
- `securityDeposit`:
- `bedrooms`:
- `bathrooms`:
- `area`:
- `availableFrom`:
- `availability`:
- `status`:
- `locationId`:
- `landlordId`:
- `categoryId`:
- `createdAt`:
- `updatedAt`:

### `property_amenities`

Properties as follows:

- `id`:
- `propertyId`:
- `amenityId`:
- `createdAt`:
- `updatedAt`:

### `property_categories`

Properties as follows:

- `id`:
- `categoryNo`:
- `name`:
- `slug`:
- `icon`:
- `createdAt`:
- `updatedAt`:

### `property_features`

Properties as follows:

- `id`:
- `propertyId`:
- `featureId`:
- `createdAt`:
- `updatedAt`:

### `property_images`

Properties as follows:

- `id`:
- `propertyId`:
- `url`:
- `isThumbnail`:
- `createdAt`:
- `updatedAt`:

### `property_rules`

Properties as follows:

- `id`:
- `propertyId`:
- `ruleId`:
- `createdAt`:
- `updatedAt`:

### `rental_requests`

Properties as follows:

- `id`:
- `tenantId`:
- `propertyId`:
- `landlordId`:
- `message`:
- `moveInDate`:
- `leaseDays`:
- `status`:
- `createdAt`:
- `updatedAt`:

### `reviews`

Properties as follows:

- `id`:
- `tenantId`:
- `propertyId`:
- `rating`:
- `comment`:
- `createdAt`:
- `updatedAt`:

### `rules`

Properties as follows:

- `id`:
- `ruleNo`:
- `name`:
- `slug`:
- `icon`:
- `createdAt`:
- `updatedAt`:

### `social_profile`

Properties as follows:

- `id`:
- `platform`:
- `url`:
- `profileId`:
- `createdAt`:
- `updatedAt`:

### `users`

Properties as follows:

- `id`:
- `name`:
- `email`:
- `phone`:
- `avatar`:
- `password`:
- `role`:
- `status`:
- `emailVerified`:
- `createdAt`:
- `updatedAt`:
