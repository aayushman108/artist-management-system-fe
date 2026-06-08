import { useMemo, useState, type ChangeEvent } from "react";
import styles from "./artistsFilter.module.scss";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";
import { usePermissions, useQuery, useUpdateQuery } from "../../../../hooks";
import {
  Button,
  SearchInput,
  Select,
  type SelectOption,
} from "../../../../common";
import { useLocation } from "react-router-dom";

interface ArtistsFiltersProps {
  managerOptions?: Artist.IManagerOption[];
}

export function ArtistsFilters({ managerOptions }: ArtistsFiltersProps) {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const { pathname } = useLocation();

  const isArtistsPage = pathname.startsWith("/artists");

  const { isSuperAdmin } = usePermissions();

  const [filters, setFilters] = useState({
    search: query.search || "",
    managerId: query.managerId || "",
  });

  const isAnyValuePresent = !!filters.search || !!filters.managerId;

  const handleClearFilters = () => {
    updateQuery({ page: "1", search: null, managerId: null });
    setFilters({ search: "", managerId: "" });
  };

  const handleApplyFilters = () => {
    updateQuery({
      page: "1",
      search: filters.search || null,
      managerId: filters.managerId || null,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const managerSelectOptions: SelectOption[] = useMemo(
    () => [
      { value: "none", label: "No Manager" },
      ...(managerOptions?.map((m) => ({ value: m.id, label: m.name })) || []),
    ],
    [managerOptions],
  );

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

      {isSuperAdmin && isArtistsPage && (
        <Select
          className={styles.filterSelect}
          label="Manager"
          name="managerId"
          options={managerSelectOptions}
          value={filters.managerId}
          onChange={handleChange}
          placeholder="All Managers"
          size="sm"
        />
      )}

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
