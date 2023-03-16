import Chip from "../../../components/Chip";
import { IMovie } from "../../../shared/interface";

interface Props {
  data: IMovie | undefined;
}

const Banner: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div>
        <img
          src={data?.backdropFullPath}
          alt=""
          className="
          w-full 
          h-[500px] 
          md:h-[700px]
          lg:h-[1200px]
          bg-center
          bg-no-repeat	
          bg-cover	
          shadow-insetShadow
          insetShadow
          "
        />
        <div
          className="absolute bg-[rgba(0,0,0,0.2)] top-0 left-0   
          w-full 
          h-[500px] 
          md:h-[700px]
          lg:h-[1200px]"
        />
      </div>

      <div
        className="w-full px-8 md:px-14 lg:px-60 absolute left-0  
          top-[200px] 
          md:top-[500px]
          lg:top-[700px] 
          space-y-3"
      >
        <p className="text-md md:text-lg lg:text-3xl font-bold">
          {data?.title}
        </p>
        <div className="flex space-x-4 flex-wrap">
          {data?.genreInfo.map((genre) => (
            <Chip name={genre.name} key={genre.id} />
          ))}
        </div>
        <div className="text-sm md:text-md lg:text-2xl line-clamp-4">
          {data?.overview}
        </div>
      </div>
    </>
  );
};

export default Banner;
