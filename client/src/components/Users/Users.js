import React from 'react';
import { Redirect } from 'react-router-dom';
import UserApi from '../../api/User';
import { toast } from 'react-toastify';

import Table from '../elements/Table';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const columns = [
  {
    id: 'username',
    label: 'Username'
  },
  {
    id: 'email',
    label: 'Email'
  },
  {
    id: 'balance',
    label: 'Balance',
    format: value => `${value.toFixed(2)} $`
  }
];

class Users extends React.PureComponent {
  state = {
    page: 0,
    rowsPerPage: 10,
    users: [],
    count: 0,
    isLoading: false
  };

  handleChangePage = async (event, newPage) => {
    await Promise.all([
      this.setState({ page: newPage, isLoading: true }),
      this.fetchData(newPage)
    ]);
    this.setState({ isLoading: false });
  };

  handleChangeRowsPerPage = async event => {
    let rowsPerPage = +event.target.value;
    await Promise.all([
      this.setState({
        rowsPerPage,
        page: 0,
        isLoading: true
      }),
      this.fetchData(0, rowsPerPage)
    ]);
    this.setState({ isLoading: false });
  };

  componentDidMount = async () => {
    await Promise.all([this.fetchData(), this.setState({ isLoading: true })]);
    this.setState({ isLoading: false });
  };

  fetchData(page, rowsPerPage) {
    return UserApi.list({
      page: page || page === 0 ? page : this.state.page,
      rowsPerPage: rowsPerPage || this.state.rowsPerPage
    }).then(data => {
      return this.setState({
        users: data.users,
        count: data.count
      });
    }).catch(err => {
      if (err && err.response) {
        toast.error(err.response.data.message);
      }
    });
  }

  render() {
    if (!this.props.user || this.props.user.type !== 'admin') {
      return <Redirect to='/' />
    }

    return (
      <Box className='box'>
        <Typography variant='h4' className='text-left space-bottom-middle'>
          Users
        </Typography>
        <Table columns={columns}
               rows={this.state.users}
               page={this.state.page}
               count={this.state.count}
               rowsPerPage={this.state.rowsPerPage}
               isLoading={this.state.isLoading}
               handleChangePage={this.handleChangePage}
               handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Box>
    );
  }
}

export default Users;