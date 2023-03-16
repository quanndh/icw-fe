import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import { Env } from "./constants/env";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import FavoritePage from "./pages/favorite";
import HomePage from "./pages/home";
import { internalRequest, request } from "./shared/utils/request";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";
import { IUserFavorite } from "./shared/interface";
import useCurrentUser from "./shared/hooks/useCurrentUser";

function App() {
  const { user } = useCurrentUser();

  const getGenres = async () => {
    const res = await request.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${Env.apiKey}&language=en-US`
    );
    localStorage.setItem("genres", JSON.stringify(res.data.genres));
  };

  const getFavorites = async () => {
    if (user) {
      const res = await internalRequest.get("/favorite");
      localStorage.setItem(
        "favorites",
        JSON.stringify(res.data.map((fav: IUserFavorite) => fav.movieId))
      );
    }
  };

  const getMe = async () => {
    try {
      const res = await internalRequest.get("/users/me");
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getGenres();
    if (localStorage.getItem("accessToken")) {
      getFavorites();
      getMe();
    }
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/favorite"
              element={
                <RequireAuth>
                  <FavoritePage />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Routes>
        <ToastContainer theme="dark" />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
