import { Collection, ObjectId } from "mongodb";
import { Vehicle, VehicleModel, Parts, PartsModel } from "./types.ts";
import { fromModelToVehicle, fromModelToparts } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: { VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehicleCollection.find().toArray();
      return vehiclesModel.map((vehicleModel) => fromModelToVehicle(vehicleModel));
    },

    vehicle: async (
      _: unknown,
      { id }: { id: string },
      context: { VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle | null> => {
      const vehicleModel = await context.VehicleCollection.findOne({
        _id: new ObjectId(id),
      });
      return vehicleModel ? fromModelToVehicle(vehicleModel) : null;
    },

    parts: async (
      _: unknown,
      __: unknown,
      context: { PartsCollection: Collection<PartsModel> },
    ): Promise<Parts[]> => {
      const partsModel = await context.PartsCollection.find().toArray();
      return partsModel.map((partModel) => fromModelToparts(partModel));
    },

    vehiclesByManufacturer: async (
      _: unknown,
      { manufacturer }: { manufacturer: string },
      context: { VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehicleCollection.find({
        manufacturer,
      }).toArray();
      return vehiclesModel.map((vehicleModel) => fromModelToVehicle(vehicleModel));
    },

    partsByVehicle: async (
      _: unknown,
      { vehicleId }: { vehicleId: string },
      context: { PartsCollection: Collection<PartsModel> },
    ): Promise<Parts[]> => {
      const partsModel = await context.PartsCollection.find({
        vehicleId,
      }).toArray();
      return partsModel.map((partsModel) => fromModelToparts(partsModel));
    },

    vehiclesByYearRange: async (
      _: unknown,
      { startYear, endYear }: { startYear: number; endYear: number },
      context: { VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehicleCollection.find({
        year: { $gte: startYear, $lte: endYear },
      }).toArray();
      return vehiclesModel.map((vehicleModel) => fromModelToVehicle(vehicleModel));
    },
  },

  Mutation: {
    addVehicle: async (
      _: unknown,
      args: { name: string; manufacturer: string; year: number;},joke:Response,parts:Parts,
      context: { VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle> => {
      joke = await fetch('https://official-joke-api.appspot.com/random_joke');
      const { name, manufacturer, year } = args;
      const { insertedId } = await context.VehicleCollection.insertOne({
        name,
        manufacturer,
        year,
        parts,
        joke
      });
      const vehicleModel = {
        _id: insertedId,
        name,
        manufacturer,
        year,
        parts,
        joke
      };
      return fromModelToVehicle(vehicleModel);
    },

    addParts: async (
      _: unknown,
      args: { name: string; price: number; vehicleId: string },
      context: { PartsCollection: Collection<PartsModel> },
    ): Promise<Parts> => {
      const { name, price, vehicleId } = args;
      const { insertedId } = await context.PartsCollection.insertOne({
        name,
        price,
        vehicleId,
      });
      const partsModel = {
        _id: insertedId,
        name,
        price,
        vehicleId,
      };
      return fromModelToparts(partsModel);
    },

    updateVehicle: async (
      _: unknown,
      { id, name, manufacturer, year }: { id: string; name: string; manufacturer: string; year: number },
      context: { VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle | null> => {
      const result = await context.VehicleCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name, manufacturer, year } },
        { returnDocument: "after" }, // Return the updated document
      );
      if (!result) return null;
      return fromModelToVehicle(result);
    },

    deletePart: async (
      _: unknown,
      args: { id: string },
      context: { PartsCollection: Collection<PartsModel> },
    ): Promise<Parts | null> => {
      const result = await context.PartsCollection.findOneAndDelete({
        _id: new ObjectId(args.id),
      });
      if (!result) return null;
      return fromModelToparts(result);
    },
  },
};
