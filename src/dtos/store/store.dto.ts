// src/dtos/store/store.dto.ts
import { Types } from "mongoose";
import { IStore } from "../../interfaces";
import { getFileUrl } from "../../utils";

// Base Store DTO with minimal properties
class StoreDtoBase implements Partial<IStore> {
  _id: Types.ObjectId;
  name: string;
  email: string;
  address: string;
  image: string;

  constructor(
    store: Pick<IStore, "_id" | "name" | "email" | "address" | "image">
  ) {
    this._id = store._id!;
    this.name = store.name;
    this.email = store.email;
    this.address = store.address;
    this.image = getFileUrl(store.image);
  }
}

// Extended Store DTO for full store details
export class StoreResponseDto extends StoreDtoBase {
  phone: string;
  document: string;

  constructor(store: IStore) {
    super(store);
    this.phone = store.phone;
    this.document = getFileUrl(store.document);
  }
}
