import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ul className="cs-pagination_box cs-center cs-white_color cs-mp0 cs-semi_bold">
      {/* Générer les numéros de page */}
      {[...Array(totalPages).keys()].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <li key={pageNumber}>
            <a
              className={`cs-pagination_item cs-center ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </a>
          </li>
        );
      })}
      {/* Flèche pour aller à la page suivante */}
      <li>
        <a
          className="cs-pagination_item cs-center"
          onClick={nextPage}
        >
          <Icon icon="akar-icons:chevron-right" />
        </a>
      </li>
    </ul>
  );
}