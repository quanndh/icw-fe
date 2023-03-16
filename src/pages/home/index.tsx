import { Box, Button, Grid, IconButton, Modal, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import { Env } from "../../constants/env";
import { IMovie } from "../../shared/interface";
import { getGenre, getPhoto } from "../../shared/utils/movie";
import { internalRequest, request } from "../../shared/utils/request";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import Chip from "../../components/Chip";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PollIcon from "@mui/icons-material/Poll";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useQueryParam } from "../../shared/hooks/useQueryParam";
import Banner from "./components/Banner";
import useCurrentUser from "../../shared/hooks/useCurrentUser";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import useFavorite from "../../shared/hooks/useFavorite";

const HomePage = () => {
  const search = useQueryParam("search");
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useCurrentUser();
  const { movieIds, add, remove } = useFavorite();

  const [banner, setBanner] = useState<IMovie>();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [totalPage, setTotalPage] = useState();
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
    let res;
    if (search && search.trim() !== "") {
      res = await request.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${Env.apiKey}&language=en-US&page=${page}&query=${search}`
      );
    } else {
      res = await request.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${Env.apiKey}&language=en-US&page=${page}`
      );
    }

    setMovies(
      res.data.results.map((movie: IMovie) => {
        const posterFullPath = getPhoto(movie.poster_path, "original");
        const backdropFullPath = getPhoto(movie.backdrop_path, "original");

        const genreInfo = getGenre(movie.genre_ids);
        return { ...movie, posterFullPath, backdropFullPath, genreInfo };
      })
    );
    setLoading(false);
    setTotalPage(res.data.total_pages);
  };

  const loadMore = async () => {
    setLoading(true);
    let res;
    if (search && search.trim() !== "") {
      res = await request.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${Env.apiKey}&language=en-US&page=${page}&query=${search}`
      );
    } else {
      res = await request.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${Env.apiKey}&language=en-US&page=${page}`
      );
    }

    setMovies([
      ...movies,
      ...res.data.results.map((movie: IMovie) => {
        const posterFullPath = getPhoto(movie.poster_path, "original");
        const backdropFullPath = getPhoto(movie.backdrop_path, "original");

        const genreInfo = getGenre(movie.genre_ids);
        return { ...movie, posterFullPath, backdropFullPath, genreInfo };
      }),
    ]);
    setLoading(false);
    setTotalPage(res.data.total_pages);
  };

  const getBanner = async () => {
    setLoading(true);
    const res = await request.get(`
    https://api.themoviedb.org/3/movie/popular?api_key=${Env.apiKey}&language=en-US&page=1&take=5`);
    const index = Math.floor(Math.random() * 20);
    const banner = res.data.results[index];
    const backdropFullPath = getPhoto(banner.backdrop_path, "original");
    const genreInfo = getGenre(banner.genre_ids);
    setBanner({ ...banner, backdropFullPath, genreInfo });
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page === 1) {
      getMovie();
    } else {
      loadMore();
    }
  }, [page, search]);

  useEffect(() => {
    getBanner();
  }, []);

  const handleLoadMore = () => {
    setPage((page) => page + 1);
  };

  const handleLike = async () => {
    console.log(user);
    if (!user) {
      console.log(111);
      toast.error("You need to login first");
      navigate(`/login?from=${location.pathname + location.search}`);
    } else {
      try {
        const { posterFullPath, backdropFullPath, genreInfo, id, ...payload } =
          movies[selectedIndex];

        const isLiked = movieIds.includes(id);

        const res = await internalRequest.post("/favorite/like", {
          userId: user.id,
          movieId: id,
          ...payload,
        });

        if (res.data) {
          toast.success(
            isLiked ? "Removed from favorite" : "Added to favorite"
          );
          if (isLiked) {
            remove(id);
          } else {
            add(id);
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      {!search && <Banner data={banner} />}
      <div className="mt-12 px-8 md:px-14 lg:px-60 bg-red space-y-2 md:space-y-6">
        {!search ? (
          <div className="text-md md:text-lg lg:text-3xl flex items-center space-x-2">
            <WhatshotIcon />
            Trending
          </div>
        ) : (
          <div className="text-md md:text-lg lg:text-3xl flex items-center space-x-2">
            <SearchIcon />
            Results for: {search}
          </div>
        )}
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
        <div className="w-full flex justify-center">
          <Button variant="outlined" color="inherit" onClick={handleLoadMore}>
            Load more
          </Button>
        </div>
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
                  {movieIds.includes(movies[selectedIndex]["id"]) ? (
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

export default HomePage;
