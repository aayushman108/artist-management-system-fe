import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import styles from "./pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
}: PaginationProps) {
  if (totalPages <= 1 && !totalResults) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(5, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 4, 2);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}></div>

      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <HiOutlineChevronLeft />
          <span>Previous</span>
        </button>

        <div className={styles.pages}>
          {getPageNumbers().map((page, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${currentPage === page ? styles.active : ""} ${page === "..." ? styles.ellipsis : ""}`}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className={styles.navBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Next</span>
          <HiOutlineChevronRight />
        </button>
      </div>
    </div>
  );
}
