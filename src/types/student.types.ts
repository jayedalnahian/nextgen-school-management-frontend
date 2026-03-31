import { UserStatus } from "./user.types";

export interface IClass {
  id: string;
  name: string;
  section: string;
  monthlyFee: number;
  capacity: number;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface IStudent {
  id: string;
  studentID: string;
  name: string;
  roll: number;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  admissionDate: string;
  isDeleted: boolean;
  parentId: string;
  classId: string;
  class: IClass;
  parent: {
    id: string;
    userId: string;
    phone: string | null;
    address: string | null;
    occupation: string | null;
    image: string | null;
    stripeCustomerId: string | null;
  };
}
