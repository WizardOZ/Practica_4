import { Vehicle, Parts, PartsModel, VehicleModel } from "./types.ts";

export const fromModelToVehicle = (vehicleModel: VehicleModel): Vehicle => {
  return {
    id: vehicleModel._id!.toString(),
    name: vehicleModel.name,
    manufacturer: vehicleModel.manufacturer,
    year: vehicleModel.year,
    joke: vehicleModel.joke,
    parts : vehicleModel.parts,
  };
};


export const fromModelToparts= (partsModel: PartsModel): Parts=> {
  return {
    id: partsModel._id!.toString(),
    name: partsModel.name,
    price: partsModel.price,
    vehicleId: partsModel.vehicleId,
  };
};
