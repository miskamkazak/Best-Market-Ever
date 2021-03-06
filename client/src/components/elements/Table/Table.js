import React, {Fragment} from 'react';

import MuiTable from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import CircularProgress from '@material-ui/core/CircularProgress';

class Table extends React.PureComponent {
  render() {
    let {
      columns = [],
      rows = [],
      page,
      rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      rowsPerPageOptions = [10, 25, 100],
      count = 0,
      height = null,
      isLoading
    } = this.props;

    return (
      <Fragment>
        <div className='operations-table-wrapper' style={{ maxHeight: height }}>
          {
            isLoading ?
              <CircularProgress className='space-top-large' />
              :
              <MuiTable stickyHeader>
                <TableHead>
                  <TableRow>
                    {
                      columns.map(column => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    rows.map(row => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id || row._id}>
                        {
                          columns.map(column => (
                            <TableCell key={column.id} align={column.align}>
                              { column.format ? column.format(row[column.id]) : row[column.id] }
                            </TableCell>
                          ))
                        }
                      </TableRow>
                    ))
                  }
                </TableBody>
              </MuiTable>
          }
        </div>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Fragment>
    )
  }
}

export default Table;