import { OptionalId } from "mongodb";

export type VehicleModel = OptionalId<{
  name: string;
  manufacturer: string;
  year: number,
  joke: Response,
  parts: Parts
}>;

export type PartsModel = OptionalId<{
  name: string,
  price: number,
  vehicleId: string,
}>

export type Vehicle = {
  id: string;
  name: string;
  manufacturer: string;
  year: number,
  joke: Response,
  parts : Parts,
};

export type Parts = {
  id: string,
  name:string,
  price: number,
  vehicleId: string,
}