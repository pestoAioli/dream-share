import type { Component } from "solid-js";
import { SocketContextProvider } from "../../contexts/socket-context-provider";
import SearchDreamsByKeyword from "./search-dreams-by-keyword";

const SearchForDreamsByKeywordWrapper: Component = () => {
  return (
    <SocketContextProvider>
      <SearchDreamsByKeyword />
    </SocketContextProvider>
  )
}

export default SearchForDreamsByKeywordWrapper;
