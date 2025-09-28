import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (search) {
        newParams.set("search", search);
        newParams.set("page", "1"); // Reset page to 1
      } else {
        newParams.delete("search"); // Remove search param if search is empty
      }

      router.replace(`?${newParams.toString()}`);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) setSearch(search);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      name="search"
      value={search}
      onChange={onInputChange}
      className="bg-white shadow-sm min-w-[220px]"
      placeholder="Search..."
    />
  );
}
