import { useEffect, useState } from "react";
import { getWikiImage, type WikiImage } from "../services/wikiImage";

type State = { status: "loading" | "ready" | "missing"; image: WikiImage | null };

export function useDishImage(title: string | null): State {
  const [state, setState] = useState<State>(() =>
    title ? { status: "loading", image: null } : { status: "missing", image: null }
  );

  useEffect(() => {
    if (!title) {
      setState({ status: "missing", image: null });
      return;
    }
    let alive = true;
    setState({ status: "loading", image: null });
    getWikiImage(title).then((image) => {
      if (alive) setState({ status: image ? "ready" : "missing", image });
    });
    return () => {
      alive = false;
    };
  }, [title]);

  return state;
}
