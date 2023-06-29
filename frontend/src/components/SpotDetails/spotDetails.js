import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";



const SpotDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(getOneSpot(id));
    }, [dispatch, id]);
    const spot = useSelector((state) => state.homePage.spotDetails);
     console.log("SPOT CONSOLE LOG 1 ===========:   " )
    console.log(spot);
    
    if (!spot) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="spotDetails">
         <h3>{spot.name}</h3>
        <h4>
          {spot.city}, {spot.state}, {spot.country}
        </h4>
        <div className="spotImages">
          {spot.SpotImages && spot.SpotImages.map((image) => (
            <img key={image.id} src={image.url} alt="Spot" />
          ))}
        </div> 
      </div>
    );
  };
  
  export default SpotDetails

