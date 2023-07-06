const Review = ({review}) => {
    return (
      <div>
        <h5>{review.User.firstName} said:</h5>
        <p>{review.comment}</p>
        <p>Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
      </div>
    );
  };
  
  export default Review;
  