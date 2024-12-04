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

      //Falta lo del fetch
      return vehiclesModel.map((vehicleModel =>
        fromModelToVehicle(vehicleModel)
      ));
    },
    vehicle: async (
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

      //Falta lo del fetch 
      return fromModelToVehicle(vehicleModel);
    },
    parts: async (
      _: unknown,
      __: unknown,
      context: {
        PartsCollection: Collection<PartsModel>
      },
    ): Promise<Parts[]> => {
      const partModel = await context.PartsCollection.find().toArray();
      return partModel.map((partModel)=> fromModelToparts(partModel));
  },
  vehiclesByManufacturer: async(
    _: unknown,
    {vehicleId}: {vehicleId:string},
    context: {
      VehicleCollection: Collection<VehicleModel>
    },
  ): Promise<Vehicle[]> =>{

    //HACER + falta lo del fetch creo

    return fromModelToVehicle();
  },
  partsByVehicle: async (
    _:unknown,
    {vehicleId}: {vehicleId: string},
    context: {
      PartsCollection: Collection<PartsModel>
    },
  ): Promise<Parts[]> => {
    const partModel = await context.PartsCollection.find({
      vehicleId
    }).toArray();

    return partModel.map((partsModel)=> fromModelToparts(partsModel));
  },
  vehiclesByYearRange: async (
    _: unknown,
    {startYear, endYear}: {startYear: number, endYear:number},
    context: {
      VehicleCollection: Collection<VehicleModel>
    },
  ): Promise<Vehicle[]> => {


    //Hacer + falta lo del fetch creo

    return fromModelToVehicle();
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
    updateVehicle: async (
      _: unknown,
      { id, name, manufacturer, year }: { id: string; name: string; manufacturer: string; year: number },
      context: { 
        VehicleCollection: Collection<VehicleModel> },
    ): Promise<Vehicle | null> => {
      const vehicleModel = await context.VehicleCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name, manufacturer, year } },
      );

      if (!vehicleModel) return null;

      return fromModelToVehicle(vehicleModel);
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
