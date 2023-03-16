import { Env } from "../../constants/env";
import { IGenre } from "../interface";

export const getPhoto = (path: string, width = "w500") => {
  return `${Env.imageUrl}/${width}${path}`;
};

export const getGenre = (ids: number[]) => {
  const genres: IGenre[] = JSON.parse(localStorage.getItem("genres") ?? "[]");
  return genres.filter((genre) => ids.includes(genre.id));
};
