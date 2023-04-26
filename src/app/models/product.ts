import { Photo } from "./Photo";

export class Product
{
  public id: number = 0; 
  public name: string;
  public categoryId: number;
  public price: number = 0; 
  public quantity: number = 0; 
  public discount: number = 0; 
  public description: string; 
  public productImages: Photo[]; 
  
}