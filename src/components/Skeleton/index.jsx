import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

const Image = styled('img')({
  width: '100%',
});

function SkeletonChildrenDemo(props) {

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>

        <Box sx={{ margin: 1 }}>
          <Skeleton sx={{ margin: 5, marginLeft: 18, backgroundColor: 'lightGray' }} width={300} variant="rounded" animation='wave'>
            <Avatar />
          </Skeleton>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: 19 }}>
          <Skeleton width="30%" sx={{ backgroundColor: 'lightGray' }}>
            <Typography>.</Typography>
          </Skeleton>
        </Box>

      </Box>
      <Box sx={{width:'100vw',display: 'flex', alignItems: 'center', justifyContent: 'center', gap:'10px', marginTop: 10 }}>
        <Skeleton sx={{ backgroundColor: 'lightGray' }}  variant="rounded" width="60%" height="200px">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
        <Skeleton sx={{ backgroundColor: 'lightGray' }}  variant="rounded" width="20%" height="200px">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
      </Box>
    </div>
  );
}

SkeletonChildrenDemo.propTypes = {
  loading: PropTypes.bool,
};

export default function SkeletonChildren() {
  return (
    <Grid container spacing={8}>

      <Grid item xs>
        <SkeletonChildrenDemo loading />
      </Grid>

    </Grid>
  );
}