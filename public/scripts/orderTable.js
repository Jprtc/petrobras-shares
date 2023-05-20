function orderTableData(column) {
  const table = document.getElementById("dataTable");
  const tbody = table.getElementsByTagName("tbody")[0];
  const rows = Array.from(tbody.getElementsByTagName("tr"));

  // Reverse the order if already sorted in ascending
  if (table.getAttribute("data-order") === "asc") {
    rows.reverse();
    table.setAttribute("data-order", "desc");
  } else {
    rows.reverse();
    table.setAttribute("data-order", "asc");
  }

  rows.forEach((row) => tbody.appendChild(row));
}
