import { useState } from "react";
import { IMovie, IUserFavorite } from "../shared/interface";

interface Props {
  data: IMovie | IUserFavorite;
  onClick: () => void;
}

const MovieCard: React.FC<Props> = ({ data, onClick }) => {
  return (
    <div
      className="relative hover:scale-110 z-10 hover:z-20 ease-in-out	duration-200 cursor-pointer"
      onClick={onClick}
    >
      <img
        className="ease-in-out	duration-200"
        src={data.posterFullPath}
        alt={data.title}
      />
    </div>
  );
};

export default MovieCard;
