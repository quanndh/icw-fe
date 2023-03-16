import { Grid, Skeleton, Button, Modal, Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import { IUser, IUserFavorite } from "../../shared/interface";
import { getGenre, getPhoto } from "../../shared/utils/movie";
import { internalRequest } from "../../shared/utils/request";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PollIcon from "@mui/icons-material/Poll";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "../../components/Chip";
import { useNavigate } from "react-router-dom";
import { logoutCleanup } from "../../shared/utils";
import { toast } from "react-toastify";
import useCurrentUser from "../../shared/hooks/useCurrentUser";
import useFavorite from "../../shared/hooks/useFavorite";

const FavoritePage = () => {
  const navigate = useNavigate();

  const { user } = useCurrentUser();
  const { movieIds, add, remove } = useFavorite();

  const [movies, setMovies] = useState<IUserFavorite[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    outline: "none",
    width: {
      xs: 300,
      sm: 500,
      md: 700,
      lg: 1000,
    },
  };

  const getMovie = async () => {
    setLoading(true);

    const res = await internalRequest.get("/favorite");

    setMovies(
      res.data.map((movie: IUserFavorite) => {
        const posterFullPath = getPhoto(movie.poster_path, "original");
        const backdropFullPath = getPhoto(movie.backdrop_path, "original");

        const genreInfo = getGenre(movie.genre_ids);
        return { ...movie, posterFullPath, backdropFullPath, genreInfo };
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    getMovie();
  }, []);

  const handleLogout = () => {
    logoutCleanup();
    window.location.href = "/";
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You need to login first");
      navigate(`/login?from=${location.pathname + location.search}`);
    } else {
      try {
        const {
          posterFullPath,
          backdropFullPath,
          genreInfo,
          movieId,
          ...payload
        } = movies[selectedIndex];

        const isLiked = movieIds.includes(movieId);

        const res = await internalRequest.post("/favorite/like", {
          movieId,
          ...payload,
          userId: user.id,
        });

        if (res.data) {
          toast.success(
            isLiked ? "Removed from favorite" : "Added to favorite"
          );
          if (isLiked) {
            setSelectedIndex(-1);
            remove(movieId);
          } else {
            add(movieId);
          }
        }
        await getMovie();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <div className="mt-12 px-8 md:px-14 lg:px-60 bg-red space-y-2 md:space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-md md:text-lg lg:text-3xl flex items-center space-x-2">
            <FavoriteIcon />
            My favorite
          </div>
          <div className="text-md md:text-lg lg:text-3xl flex items-center space-x-2">
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Grid container spacing={2}>
          {movies.length
            ? movies.map((movie, index) => (
                <Grid key={movie.id} item xs={6} sm={4} lg={3}>
                  <MovieCard
                    data={movie}
                    onClick={() => setSelectedIndex(index)}
                  />
                </Grid>
              ))
            : null}
        </Grid>
        {loading && (
          <Grid container spacing={2}>
            {[0, 0, 0, 0].map((movie, index) => (
              <Grid key={index} item xs={6} sm={4} lg={3}>
                <Skeleton
                  variant="rectangular"
                  width={"full"}
                  sx={{
                    bgcolor: "grey.900",
                    height: {
                      xs: 225,
                      md: 250,
                      lg: 350,
                      xl: 750,
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      {selectedIndex !== -1 && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={selectedIndex !== -1}
          onClose={() => setSelectedIndex(-1)}
        >
          <Box sx={style}>
            <div className="relative bg-red">
              <img
                className="aspect-video ease-in-out	duration-200"
                src={movies[selectedIndex].backdropFullPath}
                alt={movies[selectedIndex].title}
              />
              <div className="absolute top-2 right-2 bg-[rgba(0,0,0,0.3)]">
                <IconButton onClick={() => setSelectedIndex(-1)}>
                  <CloseIcon className="text-white" />
                </IconButton>
              </div>
            </div>

            <div className="bg-[rgba(0,0,0,0.3)] h-full w-full left-0 top-0 ease-in-out	duration-200 p-4 space-y-3 bg-black">
              <div className="font-semibold text-xl flex justify-between">
                {movies[selectedIndex].original_title}
                <IconButton onClick={handleLike}>
                  {movieIds.includes(movies[selectedIndex]["movieId"]) ? (
                    <FavoriteIcon className="text-white" />
                  ) : (
                    <FavoriteBorderIcon className="text-white" />
                  )}
                </IconButton>
              </div>
              <div>{movies[selectedIndex].release_date}</div>

              <div className="flex flex-wrap space-x-2">
                {movies[selectedIndex].genreInfo.map((genre) => (
                  <Chip name={genre.name} key={genre.id + "movie"} />
                ))}
              </div>
              <div className="text-sm line-clamp-3">
                {movies[selectedIndex].overview}
              </div>
              <div className="flex space-x-2 text-sm items-center">
                <ThumbUpIcon />
                {movies[selectedIndex].vote_average}
                <PollIcon />
                {movies[selectedIndex].vote_average}
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default FavoritePage;
