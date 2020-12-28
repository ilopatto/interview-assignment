export interface ImpacterDTO {
  impacter_id: number;
  name: string;
  bio: string;
  profile_image: string;
  image: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class Impacter implements ImpacterDTO {
  impacter_id: number;
  name: string;
  bio: string;
  profile_image: string;
  image: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  constructor(dto: ImpacterDTO) {
    Object.assign(this, dto);
  }
}