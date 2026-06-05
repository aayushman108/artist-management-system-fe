import { useState, type ChangeEvent } from "react";
import styles from "./invitationsFilter.module.scss";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";
import { useQuery, useUpdateQuery } from "../../../../hooks";
import { Button, SearchInput, Select } from "../../../../common";
import { USER_ROLE_ARR } from "../../../../constants/general.constant";
import { USER_INVITATION_STATUS_ARR } from "../../../../constants";

export function InvitationsFilters() {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const [filters, setFilters] = useState({
    search: query.search || "",
    role: query.role || "",
    status: query.status || "",
  });

  const isAnyValuePresent = !!(
    filters.search ||
    filters.role ||
    filters.status
  );

  const handleClearFilters = () => {
    updateQuery({
      page: "1",
      search: null,
      role: null,
      status: null,
    });
    setFilters({ search: "", role: "", status: "" });
  };

  const handleApplyFilters = () => {
    updateQuery({
      page: "1",
      search: filters.search || null,
      role: filters.role || null,
      status: filters.status || null,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

      <Select
        label="Role"
        size="sm"
        className={styles.filterSelect}
        placeholder="All Roles"
        options={USER_ROLE_ARR}
        name="role"
        value={filters.role}
        onChange={handleChange}
      />

      <Select
        label="Status"
        size="sm"
        className={styles.filterSelect}
        placeholder="All Statuses"
        options={USER_INVITATION_STATUS_ARR}
        name="status"
        value={filters.status}
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
