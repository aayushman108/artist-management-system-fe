import { useState, type ChangeEvent } from "react";
import styles from "./sentInvitationsFilter.module.scss";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";
import { useQuery, useUpdateQuery } from "../../../../hooks";
import { Button, SearchInput, Select } from "../../../../common";
import { USER_ROLE_ARR } from "../../../../constants/general.constant";
import { INVITATION_STATUS_ARR } from "../../../../constants";

export function SentInvitationsFilters() {
  const query = useQuery();
  const updateQuery = useUpdateQuery();

  const [filters, setFilters] = useState({
    search: query.s_search || "",
    role: query.s_role || "",
    status: query.s_status || "",
  });

  const isAnyValuePresent = !!(
    filters.search ||
    filters.role ||
    filters.status
  );

  const handleClearFilters = () => {
    updateQuery({
      s_page: "1",
      s_search: null,
      s_role: null,
      s_status: null,
    });
    setFilters({ search: "", role: "", status: "" });
  };

  const handleApplyFilters = () => {
    updateQuery({
      s_page: "1",
      s_search: filters.search || null,
      s_role: filters.role || null,
      s_status: filters.status || null,
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
        options={INVITATION_STATUS_ARR}
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
