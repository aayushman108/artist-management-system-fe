import { useState, type ChangeEvent } from "react";
import styles from "./artistsFilter.module.scss";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";
import { useQuery, useUpdateQuery } from "../../../../hooks";
import { Button, SearchInput } from "../../../../common";

export function ArtistsFilters() {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const [filters, setFilters] = useState({
    search: query.search || "",
  });

  const isAnyValuePresent = !!filters.search;

  const handleClearFilters = () => {
    updateQuery({ page: "1", search: null });
    setFilters({ search: "" });
  };

  const handleApplyFilters = () => {
    updateQuery({
      page: "1",
      search: filters.search || null,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className={styles.filterGroup}>
      <SearchInput
        className={styles.searchInput}
        label="Search"
        size="sm"
        placeholder="Name or email..."
        name="search"
        value={filters.search}
        onChange={handleChange}
      />

      <div className={styles.filterActions}>
        <Button size="sm" type="button" onClick={handleApplyFilters}>
          <span className={styles.btnContent}>
            <HiOutlineSearch />
            Search
          </span>
        </Button>

        {isAnyValuePresent && (
          <Button size="sm" variant="outline" onClick={handleClearFilters}>
            <span className={styles.btnContent}>
              <HiOutlineRefresh />
              Clear
            </span>
          </Button>
        )}
      </div>
    </form>
  );
}
