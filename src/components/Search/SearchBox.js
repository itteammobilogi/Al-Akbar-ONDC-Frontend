// components/SearchBox.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Search } from "lucide-react";
import debounce from "lodash.debounce";
import { getSearchProduct } from "@/utils/ApiUrlHelper";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  // Debounced API Call
  const fetchSuggestions = debounce(async (text) => {
    if (!text) return setSuggestions([]);
    try {
      const data = await getSearchProduct(text);
      setSuggestions(data.slice(0, 10));
    } catch (err) {
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel(); // cleanup
  }, [query]);

  const handleSelect = (name) => {
    router.push(
      `/searchproduct/searchProduct?search=${encodeURIComponent(name)}`
    );

    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative hidden md:block">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products, brands..."
        className="border border-gray-300 rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 w-64"
      />
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-64 bg-white border rounded-md shadow max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item.name)}
              className="px-4 py-2 cursor-pointer hover:bg-pink-50 text-sm"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
