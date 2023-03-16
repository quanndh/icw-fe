import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../shared/hooks/useCurrentUser";
import { useQueryParam } from "../shared/hooks/useQueryParam";
import BlurContainer from "./BlurContainer";

const Header = () => {
  const navigate = useNavigate();
  const search = useQueryParam("search") ?? "";

  const { user, loading } = useCurrentUser();

  const [keyword, setKeyword] = useState(search);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (keyword && keyword.trim() !== "") {
      navigate(`/?search=${keyword}`, {
        state: { search: keyword },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClick = () => {
    if (user) {
      navigate("/favorite");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-transparent w-full flex justify-between items-center py-4 px-8 md:px-14 lg:px-60 fixed z-50 space-x-2">
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => {
          setKeyword("");
          navigate("/");
        }}
      >
        The Film
      </div>
      <div className="flex items-center space-x-2">
        <BlurContainer className="rounded-md py-2 px-2 md:py-2 md:px-4">
          <div className="flex justify-between">
            <input
              className="bg-transparent w-1/3 md:w-full outline-none mr-1 md:mr-4 text-white placeholder:text-white block md:block"
              placeholder="Search"
              onChange={handleChange}
              value={keyword}
              onKeyDown={handleKeyDown}
            />
            <SearchIcon
              className="text-white cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </BlurContainer>
        <BlurContainer
          className="rounded-md py-2 px-2 md:py-2 md:px-4 cursor-pointer"
          onClick={handleClick}
        >
          {loading ? (
            <div className="font-semibold">...</div>
          ) : (
            <div className="font-semibold truncate">
              {user?.email ?? "Login"}
            </div>
          )}
        </BlurContainer>
      </div>
    </div>
  );
};

export default Header;
