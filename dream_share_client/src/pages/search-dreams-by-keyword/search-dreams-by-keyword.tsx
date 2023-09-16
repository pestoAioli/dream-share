import { createSignal, type Component, Show } from "solid-js";
import RickyButton from "../../components/button";
import { useSocket } from "../../contexts/socket-context-provider";
import { createStore } from "solid-js/store";
import DreamList from "../../components/dream-list";

const SearchDreamsByKeyword: Component = () => {
  const socketConnection = useSocket();
  const [dreams, setDreams] = createStore<Dream[]>([]);
  const [noDreamsFound, setNoDreamsFound] = createSignal(false);
  const [finding, setFinding] = createSignal(false);

  if (socketConnection) {
    socketConnection.on("dreams_found_by_keyword", (dreams: DreamsArray) => {
      setFinding(false)
      if (dreams.dreams.length == 0) {
        setNoDreamsFound(true)
      } else {
        setDreams(dreams.dreams);
      }
    })
  }




  function findUser(e: SubmitEvent) {
    e.preventDefault()
    setDreams([])
    setNoDreamsFound(false)
    const target = e.target as HTMLInputElementFindDreamByKeyword;
    let keyword = target.user_search.value;
    if (socketConnection) {
      socketConnection.push("search_dreams_by_keyword", { keyword })
    }
    target.user_search.value = "";
    return setFinding(true)
  }

  return (
    <div class="dreams-list">
      <form onSubmit={findUser} class="general-list-left" style={{ "margin-top": "8px", "margin-bottom": "8px" }}>
        <label for="user_search">Search for dreams by keyword/phrase:</label>
        <input type="text" id="user_search" name="user_search" placeholder="search by keyword" required maxlength={15} />
        <RickyButton type="submit" margin_top="8px" bg_color="aliceblue" font_size="24px">
          <Show when={finding()}>
            Searching...
          </Show>
          <Show when={!finding()}>
            Search
          </Show>
        </RickyButton>
      </form>
      <DreamList dreams={dreams} setDreams={setDreams} />
      <Show when={noDreamsFound()}>
        <h2>Sorry couldn't find any dreams with that in them boss :/</h2>
      </Show>
    </div>
  )
}

export default SearchDreamsByKeyword; 
