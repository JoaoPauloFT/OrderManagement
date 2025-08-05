import React from "react";
import PropTypes from "prop-types";

function DataTable({
  items = [],
  columns = [],
  rowKey = (item) => item.id ?? JSON.stringify(item),
  onRowClick,
  emptyMessage = "No records found.",
  className = "",
}) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-x-auto ${className}`}>
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className="bg-blue-950 text-left text-white text-sm">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-2 ${col.className ?? ""}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={rowKey(item)}
              className={`cursor-pointer hover:bg-gray-50`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col, cidx) => (
                <td key={cidx} className="px-4 py-2 align-top">
                  {typeof col.accessor === "function" ? col.accessor(item) : col.accessor}
                </td>
              ))}
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  items: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
      width: PropTypes.string,
      className: PropTypes.string,
    })
  ),
  rowKey: PropTypes.func,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
};

export default DataTable;
