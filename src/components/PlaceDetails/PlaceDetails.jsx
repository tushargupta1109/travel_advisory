import React,{useContext} from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import Rating from '@material-ui/lab/Rating';
import {favContext} from '../context';
import firebase,{ db } from "../firebase";
import useStyles from './styles.js';
import { Message } from '@material-ui/icons';

const PlaceDetails = ({ place, selected, refProp }) => {
  const [fav,setFav]=useContext(favContext);

  const uid = firebase.auth().currentUser.uid;
  const handleadd=async()=>{
    if(uid===""){
      Message.error("Not Logged In");
      return ;
    }
    const data=await db.collection("users").doc(uid).get();
    if(data){
      let fav=await data.data().fav;
      if(!fav){
        fav=[{place}];
        db.collection("users").doc(uid).set({fav},{merge:true});
      }else{
        fav.push({place});
        db.collection("users").doc(uid).set({fav},{merge:true});
      }
    }
    Message.info(`added to favourites`);

    (async function () {
      db.collection("users")
        .doc(uid) 
        .get()
        .then((data) => {
          if (data) {
            setFav(data.data().fav);
          }
        });
    })();
  }

  if (selected) refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const classes = useStyles();
  return (
    <Card elevation={6} ref={refProp}>
      <CardMedia
        style={{ height: 350 }}
        image={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
        title={place.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">{place.name}</Typography>
        <Box display="flex" justifyContent="space-between" my={2}>
          <Rating name="read-only" value={Number(place.rating)} readOnly />
          <Typography component="legend">{place.num_reviews} review{place.num_reviews > 1 && 's'}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography component="legend">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.ranking}
          </Typography>
        </Box>
        {place?.awards?.map((award) => (
          <Box display="flex" justifyContent="space-between" my={1} alignItems="center">
            <img src={award.images.small} />
            <Typography variant="subtitle2" color="textSecondary">{award.display_name}</Typography>
          </Box>
        ))}
        {place?.cuisine?.map(({ name }) => (
          <Chip key={name} size="small" label={name} className={classes.chip} />
        ))}
        {place.address && (
          <Typography gutterBottom variant="body2" color="textSecondary" className={classes.subtitle}>
            <LocationOnIcon />{place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography variant="body2" color="textSecondary" className={classes.spacing}>
            <PhoneIcon /> {place.phone}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => window.open(place.web_url, '_blank')}>
          Trip Advisor
        </Button>
        <Button size="small" color="primary" onClick={() => window.open(place.website, '_blank')}>
          Website
        </Button>
        <Button size="small" color="primary" onClick={()=>handleadd()}>
          Add to favourite
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlaceDetails;