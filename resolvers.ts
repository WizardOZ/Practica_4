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
      return vehiclesModel.map((vehicleModel =>
        fromModelToVehicle(vehicleModel)
      ));
    },
    dinosaur: async (
      _: unknown,
      { id }: { id: string },
      context: {
        VehicleCollection: Collection<VehicleModel>;
      },
    ): Promise<Vehicle | null> => {
      const vehicleModel = await context.VehicleCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!vehicleModel) {
        return null;
      }
      return fromModelToVehicle(vehicleModel);
    },
  },
  Mutation: {
    addVehicle: async (
      _: unknown,
      args: { name: string, manufacturer: string , year: number},joke:string,parts:Parts,
      context: {
        VehicleCollection: Collection<VehicleModel>;
      },
    ): Promise<Vehicle> => {
      const { name, manufacturer, year } = args;
      const { insertedId } = await context.VehicleCollection.insertOne({
        name,
        manufacturer,
        year,
        joke,
        parts
      });
      const vehicleModel = {
        _id: insertedId,
        name,
        manufacturer,
        year,
        joke,
        parts,
      };
      return fromModelToVehicle(vehicleModel!);
    },
    addParts: async (
      _:unknown,
      args: { name: string, price: number, vehicleId: string},
      context: {
        PartsCollection: Collection<PartsModel>;
      },
    ): Promise<Parts> => {
      const {name, price, vehicleId} = args;
      const {insertedId} = await context.PartsCollection.insertOne({
        name,
        price,
        vehicleId,
      })
      const partsModel = {
        _id: insertedId,
        name,
        price,
        vehicleId,
      };
      return fromModelToparts(partsModel!);
    },
    deletePart: async (
      _: unknown,
      args: { id: string },
      context: {
        PartsCollection: Collection<PartsModel>;
      },
    ): Promise<Parts | null> => {
      const id = args.id;
      const partsModel = await context.PartsCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!partsModel) {
        return null;
      }
      return fromModelToparts(partsModel);
    },
  },
};
