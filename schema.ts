export const schema = `#graphql
type Vehicle {
  id: ID!
  name: String!
  manufacturer: String!
  year: number!
  joke: String
  parts : parts
}

type Parts {
  id: ID!,
  name:String!,
  price: number!,
  vehicleId: String!,
}

type Query {
  vehicles: [Vehicle!]!
  vehicle(id: ID!): Vehicle
  parts: [Parts!]!
  vehiclesByManufacturer(manufacturer: String!): Vehicle
  partsByVehicle(vehicleId: String!): Parts
  vehiclesByYearRange(startYear: Int!, endYear: Int!): [Vehicle!]!
}

type Mutation {
  addVehicle(name: String!, manufacturer: String!, year: number!): Vehicle!
  addParts(name: String!, price: number!, vehicleId: String!): Parts!
  updateVehicle(id: ID!, name: String!, manufacturer: Sring!, year: number!): Vehicle!
  deleteParts(id: ID!): Parts
}
`;
